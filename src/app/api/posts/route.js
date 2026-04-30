import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeSlug } from '@/lib/slug';
import { BD_LOCATION_COORDS } from '@/lib/bdLocations';

function makeSlug(input = '') {
  const normalized = String(input).trim().normalize('NFC').toLowerCase();
  const slug = normalized
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Keep API usable for titles that collapse to empty.
  if (!slug) {
    return `post-${Date.now()}`;
  }

  return normalizeSlug(slug);
}

function toPrismaStatus(status) {
  if (!status) return 'PUBLISHED';
  const map = {
    draft: 'DRAFT',
    review: 'REVIEW',
    published: 'PUBLISHED',
    archived: 'ARCHIVED',
  };
  return map[String(status).toLowerCase()] || 'PUBLISHED';
}

function toPrismaSection(section) {
  if (!section) return undefined;
  const map = {
    standard: 'STANDARD',
    top: 'TOP',
    sorbosesh: 'SORBOSESH',
    live: 'LIVE',
  };
  return map[section] || undefined;
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    const category = searchParams.get('category');
    const order = searchParams.get('order');
    const slugRaw = searchParams.get('slug');
    const slug = slugRaw ? normalizeSlug(slugRaw) : null;
    const status = searchParams.get('status');
    const includeDraft = searchParams.get('includeDraft') === 'true';
    const publishedOnly = searchParams.get('publishedOnly') === '1';
    const q = searchParams.get('q');
    const location = searchParams.get('location');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const limit = parseInt(searchParams.get('limit')) || 20;

    const where = {};
    if (slug) where.slug = slug;
    if (slug && publishedOnly) where.status = 'PUBLISHED';
    if (!slug && !includeDraft) where.status = toPrismaStatus(status);
    if (!slug && includeDraft && status) where.status = toPrismaStatus(status);
    if (section) where.section = toPrismaSection(section);
    if (category) where.categoryId = category;
    if (order) where.order = parseInt(order);
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const sortField = searchParams.get('sortField') || 'order';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const posts = await prisma.post.findMany({
      where,
      orderBy: [{ [sortField]: sortOrder }, { createdAt: 'desc' }],
      take: limit,
      include: {
        category: true,
      },
    });

    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      if (!Number.isNaN(userLat) && !Number.isNaN(userLng)) {
        const nearby = posts
          .map((post) => {
            const c = post.location ? BD_LOCATION_COORDS[post.location] : null;
            if (!c) return null;
            return {
              ...post,
              distanceKm: distanceKm(userLat, userLng, c.lat, c.lng),
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, limit);
        return NextResponse.json(nearby);
      }
    }

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    // Auto-generate slug if not provided
    const rawSlug = data.slug?.trim() || makeSlug(data.title);
    const slug = normalizeSlug(rawSlug) || rawSlug;

    if (!data.title || !data.content || !data.category || !slug) {
      return NextResponse.json({ error: 'Title, content, category, and slug are required.' }, { status: 400 });
    }

    const tagIds = Array.isArray(data.tagIds) ? data.tagIds.filter(Boolean) : [];
    const section = toPrismaSection(data.section) || 'STANDARD';
    const order = Number.isFinite(data.order) ? data.order : 99;

    // Shift existing posts if the order is already taken or we want to insert at this position
    if (order < 99) {
      await prisma.post.updateMany({
        where: {
          section: section,
          order: { gte: order },
        },
        data: {
          order: { increment: 1 },
        },
      });
    }

    const post = await prisma.post.create({
      data: {
        title: data.title.trim(),
        slug,
        content: data.content,
        excerpt: data.excerpt || null,
        featuredImage: data.featuredImage || null,
        location: data.location?.trim() || null,
        categoryId: data.category,
        status: toPrismaStatus(data.status),
        section: section,
        order: order,
        isBreaking: Boolean(data.isBreaking),
        scheduledAt: null,
        publishedAt: toPrismaStatus(data.status) === 'PUBLISHED' ? new Date() : null,
        tags: tagIds.length
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
