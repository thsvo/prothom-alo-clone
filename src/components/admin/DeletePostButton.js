"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeletePostButton({ postId, postTitle }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete post");
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
      className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-wider disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
