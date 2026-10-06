import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchJadwal } from '../services/api';
import { Calendar, Clock, MapPin, User, Video, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { sounds } from '../components/AudioCues';

export default function JadwalPage() {
  const { currentUser, activeKelas, setActiveKelas, setActiveTab } = useApp();
  const [jadwalList, setJadwalList] = useState([]);
  const [selectedHari, setSelectedHari] = useState('all');
  const [loading, setLoading] = useState(true);

  const hariList = [
    { id: 'all', label: 'Semua Hari' },
    { id: 'Senin', label: 'Senin' },
    { id: 'Selasa', label: 'Selasa' },
    { id: 'Rabu', label: 'Rabu' },
    { id: 'Kamis', label: 'Kamis' },
    { id: 'Jumat', label: 'Jumat' },
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchJadwal(activeKelas, selectedHari)
      .then((res) => {
        if (isMounted && res.success) {
          setJadwalList(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeKelas, selectedHari]);

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-700" />
            Jadwal Pelajaran KBM PAI
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Jadwal tatap muka dan sesi daring KBM Pendidikan Agama Islam Kelas {activeKelas}.
          </p>
        </div>

        {/* Filter Jenjang Kelas 7, 8, 9 */}
        {currentUser?.role !== 'siswa' && (<div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
          {['7', '8', '9'].map((kls) => (
            <button
              key={kls}
              onClick={() => {
                sounds.playClick();
                setActiveKelas(kls);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeKelas === kls
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kelas {kls}
            </button>
          ))}
        </div>)}
      </div>

      {/* Filter Hari */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {hariList.map((h) => (
          <button
            key={h.id}
            onClick={() => {
              sounds.playClick();
              setSelectedHari(h.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedHari === h.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {h.label}
          </button>
        ))}
      </div>

      {/* Daftar Jadwal Card List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
          Memuat jadwal KBM...
        </div>
      ) : jadwalList.length > 0 ? (
        <div className="space-y-3">
          {jadwalList.map((item) => {
            const isLive = item.status === 'Berlangsung';
            const isDone = item.status === 'Selesai';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl bg-white border transition-all ${
                  isLive
                    ? 'border-blue-500 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20'
                    : 'border-slate-200/90 shadow-xs hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Info Jadwal */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                        {item.hari}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.jam}
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        Kelas {item.kelas}
                      </span>

                      {/* Status Pertemuan */}
                      {isLive && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-extrabold animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          SESI BERLANGSUNG
                        </span>
                      )}
                      {isDone && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Selesai
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {item.materi_pokok}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {item.guru}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.ruang}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="flex items-center gap-2 self-start md:self-center">
                    {item.link_pertemuan && (
                      <a
                        href={item.link_pertemuan}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <Video className="w-4 h-4" />
                        Gabung Virtual
                      </a>
                    )}
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setActiveTab('absensi');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      Presensi Siswa
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          Belum ada jadwal KBM PAI untuk kriteria yang dipilih.
        </div>
      )}

    </div>
  );
}
