import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchStats } from '../services/api';
import { BookOpen, Calendar, UserCheck, Award, ArrowRight, Bell, Sparkles, Clock, CheckCircle2, Video } from 'lucide-react';
import { sounds } from '../components/AudioCues';

export default function Dashboard() {
  const { activeKelas, currentUser, activeRole, setActiveTab } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchStats(activeKelas, currentUser.nama)
      .then((res) => {
        if (isMounted && res.success) {
          setStats(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeKelas, currentUser.nama]);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      
      {/* Hero Banner Islami Portal PakBani */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-blue-800 to-cyan-800 text-white p-6 sm:p-8 shadow-xl shadow-blue-950/15">
        
        {/* Ornamen Latar Belakang */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-4 top-4 opacity-10 text-8xl font-arabic pointer-events-none hidden sm:block">
          ﷽
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-blue-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Portal PakBani • Tahun Ajaran 2026/2027</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            Assalamu’alaikum, {currentUser.nama}! 👋
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
            Selamat datang di <strong className="text-white">Portal PakBani</strong> — Media Pembelajaran Digital Terpadu untuk mata pelajaran <strong>Pendidikan Agama Islam (PAI) & Budi Pekerti</strong> jenjang <span className="bg-blue-600/60 px-2 py-0.5 rounded-md font-bold">Kelas {activeKelas} SMP/MTs</span>.
          </p>

          {/* Quick Action Buttons di Hero */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('materi');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-950 font-bold text-xs shadow-md hover:bg-blue-50 transition-all cursor-pointer active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-blue-800" />
              Mulai Belajar Materi
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('absensi');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700/80 hover:bg-blue-700 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer active:scale-95"
            >
              <UserCheck className="w-4 h-4" />
              Lihat Rekap Presensi Bulanan
            </button>
          </div>
        </div>
      </div>

      {/* Ringkasan Statistik Kartu */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Materi PAI</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
            {loading ? '...' : (stats?.totalMateri || 5)} <span className="text-xs font-normal text-slate-400">Bab</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Kelas {activeKelas} SMP/MTs</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kehadiran Siswa</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
            {loading ? '...' : `${stats?.persentaseKehadiran || 100}%`}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Dikelola Pak Bani</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kuis & Ulangan</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
            {loading ? '...' : `${(stats?.totalKuis || 1) + (stats?.totalUlangan || 2)}`} <span className="text-xs font-normal text-slate-400">Paket</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Latihan & CBT</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rata-rata Nilai</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
            {loading ? '...' : (stats?.rataRataNilai || 88)}
          </p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">Tuntas KKM (75)</p>
        </div>

      </div>

      {/* Grid Dua Kolom: Jadwal & Pengumuman Pak Bani */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Jadwal KBM Terdekat */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Jadwal KBM PAI Terdekat
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('jadwal')}
              className="text-xs font-semibold text-blue-800 hover:text-blue-900 flex items-center gap-1"
            >
              Lihat Semua Jadwal <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                Memuat jadwal KBM...
              </div>
            ) : stats?.jadwalHariIni && stats.jadwalHariIni.length > 0 ? (
              stats.jadwalHariIni.map((j) => (
                <div
                  key={j.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {j.hari}, {j.jam}
                        </span>
                        <span className="text-xs font-bold text-blue-800">
                          Kelas {j.kelas}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">
                        {j.materi_pokok}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pengampu: <strong>{j.guru}</strong> • {j.ruang}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {j.link_pertemuan && (
                      <a
                        href={j.link_pertemuan}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Ruang Virtual
                      </a>
                    )}
                    <button
                      onClick={() => setActiveTab('absensi')}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 font-bold text-xs hover:bg-blue-100 flex items-center gap-1"
                    >
                      Cek Presensi
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                Tidak ada sesi jadwal aktif untuk hari ini.
              </div>
            )}
          </div>

          {/* Quick Hub Belajar PAI */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-blue-950">
                Latihan Kuis & Asesmen Mandiri
              </h3>
              <p className="text-xs text-blue-800 mt-1 max-w-md">
                Uji pemahaman materi Anda dengan kuis interaktif berwaktu atau ikuti Ulangan CBT resmi dengan token ujian dari Pak Bani.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('kuis')}
                className="px-3 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Kuis
              </button>
              <button
                onClick={() => setActiveTab('ulangan')}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                CBT
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pengumuman Pak Bani */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Pengumuman Pak Bani
            </h2>
          </div>

          <div className="space-y-3">
            {stats?.pengumuman?.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                  <span className="font-semibold text-amber-600">Pemberitahuan</span>
                  <span>{p.tanggal}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {p.judul}
                </h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                  {p.isi}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Oleh: <strong>{p.penulis}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Doa Belajar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 text-center">
            <p className="text-[11px] font-bold text-blue-800 mb-1">Doa Menuntut Ilmu</p>
            <p className="text-sm font-arabic text-slate-800 my-1 leading-loose">
              رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا
            </p>
            <p className="text-[10px] text-slate-500 italic">
              "Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan dan berilah aku karunia untuk memahaminya."
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
