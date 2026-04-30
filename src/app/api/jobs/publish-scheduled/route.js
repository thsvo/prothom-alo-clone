import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = process.env.CRON_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const result = await prisma.post.updateMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          lte: now,
        },
      },
      data: {
        status: "PUBLISHED",
        publishedAt: now,
      },
    });

    return NextResponse.json({
      publishedCount: result.count,
      executedAt: now.toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
