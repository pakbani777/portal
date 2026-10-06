import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, UserCheck, ShieldCheck, GraduationCap, Sparkles, User as UserIcon, Menu, X } from 'lucide-react';
import { sounds } from './AudioCues';
import ProfileModal from './ProfileModal';
import { API_BASE_URL } from '../config';

export default function Navbar() {
  const { isMobileMenuOpen, setIsMobileMenuOpen, activeRole, setActiveRole, activeKelas, setActiveKelas, currentUser, showToast, logout } = useApp();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleRoleToggle = () => {
    sounds.playClick();
    const nextRole = activeRole === 'siswa' ? 'guru' : 'siswa';
    setActiveRole(nextRole);
    showToast(`Beralih ke Mode ${nextRole === 'guru' ? 'Guru (Pak Bani)' : 'Siswa'}`);
  };

  const handleKelasChange = (e) => {
    sounds.playClick();
    setActiveKelas(e.target.value);
    showToast(`Memilih materi & presensi Kelas ${e.target.value}`);
  };

  const handleLogout = () => {
    sounds.playClick();
    logout();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Judul: Portal PakBani */}
          <div className="flex items-center gap-3"><button className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-800 via-blue-700 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-800/20">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  Portal <span className="text-blue-700 font-black">PakBani</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  PAI SMP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Pendidikan Agama Islam & Budi Pekerti
              </p>
            </div>
          </div>

          {/* Kontrol Cepat: Pilihan Kelas & Switcher Peran */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Pilihan Jenjang Kelas 7, 8, 9 */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 pl-2 pr-1 hidden sm:inline">
                Jenjang:
              </span>
              <select
                value={activeKelas}
                onChange={handleKelasChange}
                className="bg-transparent text-xs font-bold text-slate-800 py-1.5 px-2 rounded-lg cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">Kelas 7</option>
                <option value="8">Kelas 8</option>
                <option value="9">Kelas 9</option>
              </select>
            </div>

            {/* Quick Switch Role: Siswa / Guru (Hanya untuk Demo) */}
            <button
              onClick={handleRoleToggle}
              title="Klik untuk beralih antara Mode Siswa dan Mode Guru (Pak Bani)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                activeRole === 'guru'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}
            >
              {activeRole === 'guru' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Mode Guru</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Mode Siswa</span>
                </>
              )}
            </button>

            {/* Avatar Singkat */}
            <div className="flex items-center gap-2 pl-1 sm:pl-3 border-l border-slate-200">
              <div 
                onClick={() => { sounds.playClick(); setIsProfileOpen(true); }}
                className="group relative cursor-pointer"
                title="Edit Profil"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 border-2 border-white shadow-xs overflow-hidden flex items-center justify-center text-blue-800 font-bold text-xs group-hover:ring-2 group-hover:ring-blue-400 transition-all">
                  {currentUser?.foto_profil ? (
                    <img src={`${API_BASE_URL}${currentUser.foto_profil}`} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    currentUser?.nama.charAt(0)
                  )}
                </div>
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <p className="font-bold text-slate-800 line-clamp-1">{currentUser?.nama}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-slate-500">
                    {activeRole === 'guru' ? 'Guru Pengampu PAI' : `Siswa Kelas ${activeKelas}`}
                  </p>
                  <button onClick={handleLogout} className="text-[10px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer">
                    Keluar
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </header>
  );
}
