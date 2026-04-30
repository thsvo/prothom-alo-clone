import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, Edit3 } from "lucide-react";
import DeleteUserButton from "@/components/admin/DeleteUserButton";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Users className="text-brand-red" size={28} />
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Users</h2>
            <p className="text-slate-500 mt-1">
              As admin you can change anyone&apos;s name, email, role, password, and active status.
            </p>
          </div>
        </div>
        <Link
          href="/admin/users/new"
          className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          Create New User
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs">Name</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs">Email</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs">Role</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs">Status</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{u.name}</td>
                <td className="px-6 py-4 text-slate-600">{u.email}</td>
                <td className="px-6 py-4">
                   <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider">
                     {u.role}
                   </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 font-bold ${u.isActive ? "text-green-600" : "text-slate-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-green-600" : "bg-slate-300"}`}></span>
                    {u.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-slate-400 hover:text-brand-red transition-colors"
                      title="Edit User"
                    >
                      <Edit3 size={18} />
                    </Link>
                    <DeleteUserButton userId={u.id} userName={u.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

