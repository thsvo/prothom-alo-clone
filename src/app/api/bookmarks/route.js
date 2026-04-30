import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const userId = body.userId;
    const postId = body.postId;

    if (!userId || !postId) {
      return NextResponse.json({ error: "userId and postId are required." }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_postId: { userId, postId },
      },
      update: {},
      create: {
        userId,
        postId,
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
