import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

const ROLES = new Set(["ADMIN", "EDITOR", "REPORTER", "READER"]);

export async function PATCH(req, { params }) {
  try {
    const me = await getCurrentUser();
    if (!me || me.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const role = body.role;
    const password = body.password;
    const isActive = typeof body.isActive === "boolean" ? body.isActive : undefined;

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const data = {};

    if (name) data.name = name;

    if (email && email !== target.email) {
      const taken = await prisma.user.findUnique({ where: { email } });
      if (taken) {
        return NextResponse.json(
          { error: "That email is already in use." },
          { status: 400 },
        );
      }
      data.email = email;
    }

    if (role) {
      if (!ROLES.has(role)) {
        return NextResponse.json({ error: "Invalid role." }, { status: 400 });
      }
      if (target.id === me.id && role !== "ADMIN") {
        return NextResponse.json(
          { error: "You cannot remove your own ADMIN role." },
          { status: 400 },
        );
      }
      data.role = role;
    }

    if (typeof isActive === "boolean") {
      if (target.id === me.id && !isActive) {
        return NextResponse.json(
          { error: "You cannot deactivate your own account." },
          { status: 400 },
        );
      }
      data.isActive = isActive;
    }

    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters." },
          { status: 400 },
        );
      }
      data.passwordHash = await hashPassword(password);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const me = await getCurrentUser();
    if (!me || me.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { id } = await params;
    if (id === me.id) {
      return NextResponse.json({ error: "You cannot delete yourself." }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

