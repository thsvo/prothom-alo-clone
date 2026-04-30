import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeSlug } from "@/lib/slug";

export async function POST(req) {
  try {
    const body = await req.json();
    const slug = normalizeSlug(body.slug);

    if (!slug) {
      return NextResponse.json({ error: "slug is required." }, { status: 400 });
    }

    const post = await prisma.post.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    await prisma.postView.create({
      data: { postId: post.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
