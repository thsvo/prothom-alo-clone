import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionCookieName } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";

const ADMIN_ROLE_SET = new Set(["ADMIN", "EDITOR"]);

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "This account is disabled." },
        { status: 403 },
      );
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        canAccessAdmin: ADMIN_ROLE_SET.has(user.role),
      },
    });

    response.cookies.set(getSessionCookieName(), user.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
