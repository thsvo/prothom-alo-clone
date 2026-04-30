"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteUserButton({ userId, userName }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }

      router.refresh();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
      title="Delete User"
    >
      <Trash2 size={18} />
    </button>
  );
}
