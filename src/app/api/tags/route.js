import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function createSlug(input = "") {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: [{ name: "asc" }],
    });
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json({ error: "Tag name is required." }, { status: 400 });
    }

    const slug = body.slug?.trim() || createSlug(name);
    const tag = await prisma.tag.create({
      data: { name, slug },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
