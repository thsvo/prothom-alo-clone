import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeSlug } from "@/lib/slug";

function toPrismaStatus(status) {
  if (!status) return undefined;
  const map = {
    draft: "DRAFT",
    review: "REVIEW",
    published: "PUBLISHED",
    archived: "ARCHIVED",
  };
  return map[String(status).toLowerCase()] || undefined;
}

function toPrismaSection(section) {
  if (!section) return undefined;
  const map = {
    standard: "STANDARD",
    top: "TOP",
    sorbosesh: "SORBOSESH",
    live: "LIVE",
  };
  return map[String(section).toLowerCase()] || undefined;
}

export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const tagIds = Array.isArray(data.tagIds) ? data.tagIds.filter(Boolean) : null;

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title: data.title?.trim() || undefined,
        slug: data.slug?.trim() ? normalizeSlug(data.slug.trim()) : undefined,
        content: data.content ?? undefined,
        excerpt: data.excerpt ?? undefined,
        featuredImage: data.featuredImage ?? undefined,
        location:
          data.location === null
            ? null
            : typeof data.location === "string"
              ? data.location.trim() || null
              : undefined,
        categoryId: data.category || undefined,
        status: toPrismaStatus(data.status),
        section: toPrismaSection(data.section),
        order: Number.isFinite(data.order) ? data.order : undefined,
        isBreaking: typeof data.isBreaking === "boolean" ? data.isBreaking : undefined,
        scheduledAt: null,
        publishedAt:
          toPrismaStatus(data.status) === "PUBLISHED"
            ? new Date()
            : data.status === "draft" || data.status === "review"
              ? null
              : undefined,
        revision: {
          increment: 1,
        },
        tags:
          tagIds !== null
            ? {
                deleteMany: {},
                create: tagIds.map((tagId) => ({
                  tag: { connect: { id: tagId } },
                })),
              }
            : undefined,
      },
      include: {
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
