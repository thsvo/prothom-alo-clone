import Link from 'next/link';
import { requireRoles } from '@/lib/auth';
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  Settings, 
  Globe,
  PlusCircle,
  Menu,
  Users,
} from 'lucide-react';

export default async function AdminLayout({ children }) {
  const user = await requireRoles(["ADMIN", "EDITOR"]);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 bg-brand-red rounded flex items-center justify-center text-white font-serif">স</span>
            Admin Panel
          </h1>
        </div>
        
        <nav className="grow p-4 space-y-2 mt-4">
          <AdminNavLink href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <AdminNavLink href="/admin/posts" icon={<FileText size={20} />} label="News / Posts" />
          <AdminNavLink href="/admin/review" icon={<FileText size={20} />} label="Review Queue" />
          <AdminNavLink href="/admin/categories" icon={<Layers size={20} />} label="Categories" />
          <AdminNavLink href="/admin/tags" icon={<Layers size={20} />} label="Tags" />
          <AdminNavLink href="/admin/newsletter" icon={<Globe size={20} />} label="Newsletter" />
          {user.role === "ADMIN" && (
            <AdminNavLink href="/admin/users" icon={<Users size={20} />} label="Users" />
          )}
          <AdminNavLink href="/admin/media" icon={<ImageIcon size={20} />} label="Media Manager" />
          <div className="pt-4 mt-4 border-t border-slate-800">
            <AdminNavLink href="/" icon={<Globe size={20} />} label="View Website" target="_blank" />
            <AdminNavLink href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          v1.0.0 © সময়ের ঘটনা
        </div>
      </aside>

      {/* Main Content */}
      <div className="grow flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="md:hidden">
            <Menu size={24} className="text-slate-600" />
          </div>
          <div className="grow"></div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/posts/new" 
              className="bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-red-700 transition-colors"
            >
              <PlusCircle size={18} />
              Create News
            </Link>
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border border-gray-300">
              {user.name?.[0] || "A"}
            </div>
          </div>
        </header>
        
        <main className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminNavLink({ href, icon, label, target }) {
  return (
    <Link 
      href={href} 
      target={target}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all group"
    >
      <span className="text-slate-400 group-hover:text-brand-red transition-colors">
        {icon}
      </span>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
