import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, BookOpen, ClipboardList, UserCheck, FileSpreadsheet, Settings, Sparkles, LogOut } from 'lucide-react';
import { sounds } from './AudioCues';

export default function Sidebar() {
  const { activeTab, setActiveTab, activeRole, activeKelas, isMobileMenuOpen, setIsMobileMenuOpen, logout } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Beranda', desc: 'Ringkasan & KBM', icon: LayoutDashboard },
    { id: 'materi', label: 'Materi Pembelajaran', desc: `PAI Kelas ${activeKelas}`, icon: BookOpen },
    { id: 'jadwal', label: 'Jadwal Pelajaran', desc: 'Agenda Mingguan', icon: Calendar },
    { id: 'absensi', label: 'Presensi Bulanan', desc: 'Kelola Kehadiran', icon: UserCheck },
    { id: 'kuis', label: 'Kuis Interaktif', desc: 'Latihan & Nilai', icon: Award },
    { id: 'ulangan', label: 'Ulangan CBT', desc: 'Ujian UH/PTS/PAS', icon: FileSpreadsheet },
    ...(activeRole === 'guru' ? [{ id: 'admin', label: 'Panel Pak Bani', desc: 'Buku Nilai & Materi', icon: Settings }] : [])
  ];

  return (
    <aside className={`
      fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200/80 p-4 flex flex-col transition-transform duration-300 ease-in-out
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
    `}>
      
      <div className="mb-3 px-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Menu Portal PakBani
        </span>
      </div>

      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(item.id); setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-800 to-blue-700 text-white shadow-md shadow-blue-800/20 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs leading-none">{item.label}</p>
                <p className={`text-[10px] mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Widget Hikmah Islami Harian */}
      
      {/* Tombol Logout (Mobile) */}
      <div className="md:hidden mt-3 p-3 pt-0">
        <button 
          onClick={() => {
            setIsMobileMenuOpen(false);
            logout();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar (Logout)
        </button>
      </div>

      <div className="mt-auto p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/80">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-[11px] font-bold text-blue-900">Hikmah Hari Ini</span>
        </div>
        <p className="text-[11px] text-slate-600 italic leading-relaxed">
          "Barang siapa menempuh jalan untuk mencari ilmu, Allah akan mudahkan jalannya menuju surga."
        </p>
        <p className="text-[10px] font-semibold text-blue-700 mt-1">HR. Muslim • Pengampu: Pak Bani</p>
      </div>

    </aside>
  );
}
