'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, LogOut, Settings, GraduationCap, BookOpen, Menu, X, Home } from 'lucide-react';
import { logout } from '@/app/admin/actions';

export default function AdminSidebar({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
      isActive 
        ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' 
        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
    }`;
  };

  const SidebarContent = (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
        <Link href="/admin" className="font-extrabold text-xl text-blue-600 dark:text-blue-400">
          ASCA Admin
        </Link>
        <button onClick={toggleSidebar} className="md:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <Link href="/admin" onClick={() => setIsOpen(false)} className={getLinkClass('/admin')}>
          <LayoutDashboard className="h-5 w-5" /> Dashboard
        </Link>
        <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Home className="h-5 w-5" /> Kembali ke Website
        </Link>
        <div className="pt-4 pb-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Pendaftaran</div>
        <Link href="/admin/pendaftar-rqa" onClick={() => setIsOpen(false)} className={getLinkClass('/admin/pendaftar-rqa')}>
          <BookOpen className="h-5 w-5 text-orange-500" /> Pendaftar RQA
        </Link>
        <Link href="/admin/pendaftar-sdqu" onClick={() => setIsOpen(false)} className={getLinkClass('/admin/pendaftar-sdqu')}>
          <GraduationCap className="h-5 w-5 text-blue-500" /> Pendaftar SDQu
        </Link>
        
        <div className="pt-4 pb-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Konten Utama</div>
        <Link href="/admin/berita" onClick={() => setIsOpen(false)} className={getLinkClass('/admin/berita')}>
          <FileText className="h-5 w-5" /> Berita & Artikel
        </Link>
        <Link href="/admin/pengajar" onClick={() => setIsOpen(false)} className={getLinkClass('/admin/pengajar')}>
          <Users className="h-5 w-5" /> Tenaga Pengajar
        </Link>
        <Link href="/admin/testimoni" onClick={() => setIsOpen(false)} className={getLinkClass('/admin/testimoni')}>
          <BookOpen className="h-5 w-5" /> Testimoni / Komentar
        </Link>

        <div className="pt-4 pb-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Sistem</div>
        <Link href="/admin/pengaturan" onClick={() => setIsOpen(false)} className={getLinkClass('/admin/pengaturan')}>
          <Settings className="h-5 w-5" /> Pengaturan Web
        </Link>
        <Link href="/admin/pengguna" onClick={() => setIsOpen(false)} className={getLinkClass('/admin/pengguna')}>
          <Users className="h-5 w-5" /> Kelola Admin
        </Link>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 font-bold">
            {session?.name?.[0] || 'A'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate text-slate-900 dark:text-white">{session?.name || 'Admin'}</p>
            <p className="text-xs text-slate-500 truncate">@{session?.username || 'admin'}</p>
          </div>
        </div>
        <form action={logout}>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 py-2 text-sm font-medium hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-900/50 transition-colors">
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 md:hidden sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/admin" className="font-extrabold text-xl text-blue-600 dark:text-blue-400">
            ASCA Admin
          </Link>
        </div>
        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 font-bold text-sm">
          {session?.name?.[0] || 'A'}
        </div>
      </header>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {SidebarContent}
      </aside>
    </>
  );
}
