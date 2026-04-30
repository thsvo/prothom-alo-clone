import Link from "next/link";

export default function AdminMediaPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-3xl font-bold text-slate-800">Media</h2>
      <p className="text-slate-600">
        Images are uploaded per story via the post editor (Featured image → ImgBB). There is no separate media library yet.
      </p>
      <Link
        href="/admin/posts/new"
        className="inline-block text-brand-red font-bold hover:underline"
      >
        Open new post →
      </Link>
    </div>
  );
}
