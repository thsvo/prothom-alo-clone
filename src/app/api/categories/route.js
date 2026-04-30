import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const name = data.name?.trim();
    const slug =
      data.slug?.trim() ||
      name?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: data.description?.trim() || null,
        order: Number.isFinite(data.order) ? data.order : 0,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
