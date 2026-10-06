import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, BookOpen, Calendar, UserCheck, Award, Settings } from 'lucide-react';
import { sounds } from './AudioCues';

export default function BottomNav() {
  const { activeTab, setActiveTab, activeRole } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'materi', label: 'Materi', icon: BookOpen },
    { id: 'jadwal', label: 'Jadwal', icon: Calendar },
    { id: 'absensi', label: 'Absensi', icon: UserCheck },
    { id: 'kuis', label: 'Kuis', icon: Award },
    ...(activeRole === 'guru' ? [{ id: 'admin', label: 'Kelola', icon: Settings }] : [])
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
                isActive
                  ? 'text-blue-700 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-blue-100 text-blue-700 shadow-xs' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
