import { requireAdmin } from "@/lib/auth";
import AdminUserEditForm from "@/components/admin/AdminUserEditForm";

export default async function AdminUserCreatePage() {
  await requireAdmin();

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Create New User</h2>
        <p className="text-slate-500 mt-1">Add a new staff member or administrator.</p>
      </div>
      <AdminUserEditForm />
    </div>
  );
}
