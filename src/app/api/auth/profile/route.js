import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function PATCH(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const currentPassword = body.currentPassword;
    const newPassword = body.newPassword;

    const changingEmail = email && email !== user.email;
    const changingPassword = Boolean(newPassword);

    if (changingEmail || changingPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to change email or password." },
          { status: 400 },
        );
      }
      if (!user.passwordHash) {
        return NextResponse.json(
          { error: "Account has no password set. Contact an administrator." },
          { status: 400 },
        );
      }
      const valid = await verifyPassword(currentPassword, user.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 401 },
        );
      }
    }

    const data = {};
    if (name) data.name = name;
    if (changingEmail) {
      const taken = await prisma.user.findUnique({ where: { email } });
      if (taken && taken.id !== user.id) {
        return NextResponse.json(
          { error: "That email is already in use." },
          { status: 400 },
        );
      }
      data.email = email;
    }
    if (changingPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters." },
          { status: 400 },
        );
      }
      data.passwordHash = await hashPassword(newPassword);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
