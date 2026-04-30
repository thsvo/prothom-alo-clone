import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "prothomalo_session";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionUserId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: sessionUserId },
    });
    return user;
  } catch {
    return null;
  }
}

export async function requireRoles(allowedRoles = []) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!allowedRoles.includes(user.role)) {
    redirect("/");
  }

  return user;
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/admin");
  }

  return user;
}
