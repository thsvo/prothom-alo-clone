import {
  FileText,
  Layers,
  Users,
  Clock,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function formatRelative(date) {
  if (!date) return "";
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default async function AdminDashboard() {
  const me = await getCurrentUser();

  const [
    totalPosts,
    publishedCount,
    queueCount,
    categoriesCount,
    usersCount,
    newsletterActive,
    recentPosts,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({
      where: { status: { in: ["DRAFT", "REVIEW"] } },
    }),
    prisma.category.count(),
    prisma.user.count(),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    prisma.post.findMany({
      take: 8,
      orderBy: { updatedAt: "desc" },
      include: { category: true },
    }),
  ]);

  const stats = [
    {
      label: "Total posts",
      value: String(totalPosts),
      hint: `${publishedCount} published`,
      icon: <FileText className="text-blue-600" />,
    },
    {
      label: "Review queue",
      value: String(queueCount),
      hint: "Draft + in review",
      icon: <Clock className="text-amber-600" />,
    },
    {
      label: "Categories",
      value: String(categoriesCount),
      hint: "Sections",
      icon: <Layers className="text-orange-600" />,
    },
    {
      label: "Team accounts",
      value: String(usersCount),
      hint: `${newsletterActive} newsletter subs`,
      icon: <Users className="text-green-600" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 mt-1">
          {me?.name ? `Welcome back, ${me.name}.` : "Welcome back."} Numbers below come from your database.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                {stat.hint}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-brand-red" />
              Recently updated
            </h3>
            <Link
              href="/admin/posts"
              className="text-sm text-brand-red font-medium hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPosts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No posts yet.{" "}
                <Link href="/admin/posts/new" className="text-brand-red font-bold hover:underline">
                  Create the first story
                </Link>
              </div>
            ) : (
              recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.id}`}
                  className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0 overflow-hidden flex items-center justify-center text-xs text-gray-400">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-mono text-[10px]">—</span>
                    )}
                  </div>
                  <div className="grow min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{post.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {post.category?.name || "Uncategorised"} · {post.status} ·{" "}
                      {formatRelative(post.updatedAt)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-center items-center text-center space-y-6">
          <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red">
            <PlusCircle size={40} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Publish a story</h3>
            <p className="text-slate-500 mt-2 max-w-xs">
              Create or edit posts; they appear on the site when status is Published.
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            New post
          </Link>
          {queueCount > 0 && (
            <Link
              href="/admin/review"
              className="text-sm text-brand-red font-medium hover:underline"
            >
              {queueCount} in review queue →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
