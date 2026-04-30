import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminUserEditForm from "@/components/admin/AdminUserEditForm";

export default async function AdminUserEditPage({ params }) {
  await requireAdmin();
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) notFound();

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Edit user</h2>
        <p className="text-slate-500 mt-1">{user.email}</p>
      </div>
      <AdminUserEditForm user={user} />
    </div>
  );
}
