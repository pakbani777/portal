import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { loginUser } from '../services/api';
import { BookOpen, GraduationCap, ShieldCheck, Lock, User, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { sounds } from '../components/AudioCues';

export default function LoginPage() {
  const { login, showToast } = useApp();

  const [activeLoginType, setActiveLoginType] = useState('siswa'); // 'siswa' atau 'guru'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    sounds.playClick();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await loginUser({
        username: username.trim(),
        password: password.trim(),
        role: activeLoginType
      });

      if (res.success) {
        sounds.playSuccess();
        showToast(res.message);
        login(res.data);
      } else {
        sounds.playError();
        setErrorMsg(res.message || 'Login gagal');
      }
    } catch (err) {
      sounds.playError();
      setErrorMsg('Gagal terhubung ke server backend');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login Handler
  const handleQuickLogin = (uname, pass, role) => {
    sounds.playClick();
    setUsername(uname);
    setPassword(pass);
    setActiveLoginType(role);
    setErrorMsg('');
    setLoading(true);

    loginUser({ username: uname, password: pass, role })
      .then(res => {
        if (res.success) {
          sounds.playSuccess();
          showToast(res.message);
          login(res.data);
        } else {
          setErrorMsg(res.message);
        }
      })
      .catch(() => setErrorMsg('Gagal login'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Ornamen Latar Islami */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute text-9xl text-white/5 font-arabic select-none pointer-events-none">
        ﷽
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10 border border-slate-100">
        
        {/* Logo & Judul */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-800 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/30 mb-3">
            <BookOpen className="w-7 h-7 text-amber-300" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Portal <span className="text-blue-700">PakBani</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Media Pembelajaran Digital PAI & Budi Pekerti (SMP/MTs)
          </p>
        </div>

        {/* Tab Switcher: Murid vs Guru Admin */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-5 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveLoginType('siswa');
              setUsername('');
              setPassword('');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeLoginType === 'siswa'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Login Murid</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveLoginType('guru');
              setUsername('');
              setPassword('');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeLoginType === 'guru'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Login Guru Admin</span>
          </button>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {activeLoginType === 'guru' ? 'Username Guru (Pak Bani)' : 'NISN / Username Siswa'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder={activeLoginType === 'guru' ? 'Masukkan username (pakbani)' : 'Contoh: 0081234501 atau ahmad'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="Masukkan kata sandi..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center animate-in fade-in">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeLoginType === 'guru'
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                : 'bg-blue-800 hover:bg-blue-900 shadow-blue-800/30'
            } disabled:opacity-50`}
          >
            {loading ? 'Memverifikasi...' : `Masuk sebagai ${activeLoginType === 'guru' ? 'Guru Admin' : 'Murid'}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Akses Cepat Demo (Satu Klik Masuk) */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Akses Cepat Pengujian (1-Klik Masuk)
          </p>

          <div className="grid grid-cols-2 gap-2 text-left">
            <button
              type="button"
              onClick={() => handleQuickLogin('pakbani', 'pakbani123', 'guru')}
              className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 transition-all cursor-pointer"
            >
              <span className="text-[10px] font-bold uppercase block text-amber-700">Admin</span>
              <span className="text-xs font-extrabold block">Pak Bani, S.Pd.I</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('ahmad', 'siswa123', 'siswa')}
              className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 transition-all cursor-pointer"
            >
              <span className="text-[10px] font-bold uppercase block text-blue-700">Murid Kelas 7-A</span>
              <span className="text-xs font-extrabold block">Ahmad Fauzi</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('aditya', 'siswa123', 'siswa')}
              className="text-[11px] font-semibold text-slate-500 hover:text-blue-700 underline cursor-pointer"
            >
              Murid Kelas 8-A (Aditya)
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => handleQuickLogin('alif', 'siswa123', 'siswa')}
              className="text-[11px] font-semibold text-slate-500 hover:text-blue-700 underline cursor-pointer"
            >
              Murid Kelas 9-A (Alif)
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
