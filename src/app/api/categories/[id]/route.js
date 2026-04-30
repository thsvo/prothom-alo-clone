import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(_req, { params }) {
  try {
    const me = await getCurrentUser();
    if (!me || me.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { id } = await params;
    
    // Check if category has posts
    const postsCount = await prisma.post.count({ where: { categoryId: id } });
    if (postsCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category with ${postsCount} posts. Move them first.` 
      }, { status: 400 });
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
