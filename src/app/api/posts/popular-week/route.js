import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MS_DAY = 86400000;

export async function GET() {
  try {
    const since = new Date(Date.now() - 7 * MS_DAY);

    const grouped = await prisma.postView.groupBy({
      by: ["postId"],
      where: { viewedAt: { gte: since } },
      _count: { id: true },
    });

    const ranked = [...grouped].sort((a, b) => b._count.id - a._count.id).slice(0, 10);

    if (ranked.length === 0) {
      return NextResponse.json([]);
    }

    const ids = ranked.map((r) => r.postId);
    const posts = await prisma.post.findMany({
      where: {
        id: { in: ids },
        status: "PUBLISHED",
      },
      include: { category: true },
    });

    const viewMap = new Map(ranked.map((r) => [r.postId, r._count.id]));
    const ordered = ids
      .map((id) => posts.find((p) => p.id === id))
      .filter(Boolean)
      .map((p) => ({
        ...p,
        viewsThisWeek: viewMap.get(p.id) ?? 0,
      }));

    return NextResponse.json(ordered);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
