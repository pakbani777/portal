import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchMateri, fetchMateriById } from '../services/api';
import { BookOpen, Search, Filter, CheckCircle2, Bookmark, ArrowLeft, Volume2, Share2, Check, Sparkles, BookMarked, Eye } from 'lucide-react';
import { sounds } from '../components/AudioCues';

export default function MateriPage() {
  const { currentUser, activeKelas, setActiveKelas, readMateriIds, toggleMateriComplete, showToast, activeMateriDetailId, setActiveMateriDetailId } = useApp();
  const [materiList, setMateriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reader detail state
  const [detailMateri, setDetailMateri] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [fontSize, setFontSize] = useState('text-base'); // text-sm, text-base, text-lg

  const categories = [
    { id: 'all', label: 'Semua Bab' },{ id: 'Pendidikan Agama Kristen (PAK)', label: 'PAK' },
    { id: 'Al-Qur\'an & Hadis', label: 'Al-Qur\'an & Hadis' },
    { id: 'Akidah', label: 'Akidah' },
    { id: 'Akhlak', label: 'Akhlak' },
    { id: 'Fiqih Ibadah', label: 'Fiqih Ibadah' },
    { id: 'Sejarah Kebudayaan Islam', label: 'Sejarah Islam' },
  ];

  // Fetch materi
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchMateri(activeKelas, selectedCategory, searchQuery)
      .then((res) => {
        if (isMounted && res.success) {
          setMateriList(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeKelas, selectedCategory, searchQuery]);

  // Open detail jika activeMateriDetailId berubah
  useEffect(() => {
    if (activeMateriDetailId) {
      setDetailLoading(true);
      fetchMateriById(activeMateriDetailId)
        .then((res) => {
          if (res.success) {
            setDetailMateri(res.data);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        })
        .finally(() => setDetailLoading(false));
    } else {
      setDetailMateri(null);
    }
  }, [activeMateriDetailId]);

  const handleOpenDetail = (materi) => {
    sounds.playClick();
    setActiveMateriDetailId(materi.id);
  };

  const handleBackToList = () => {
    sounds.playClick();
    setActiveMateriDetailId(null);
  };

  const handleToggleRead = (id) => {
    sounds.playSuccess();
    toggleMateriComplete(id);
    const isNowDone = !readMateriIds.includes(id);
    showToast(isNowDone ? 'Alhamdulillah, materi selesai dibaca! ✨' : 'Status materi direset ke belum selesai.');
  };

  // Jika sedang membuka detail pembaca materi
  if (detailMateri) {
    const isCompleted = readMateriIds.includes(detailMateri.id);

    return (
      <div className="space-y-6 pb-24 md:pb-8 max-w-4xl mx-auto">
        
        {/* Tombol Kembali & Aksi Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Materi
          </button>

          <div className="flex items-center gap-2">
            {/* Pengatur Ukuran Huruf */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs">
              <span className="px-2 font-semibold text-slate-400">Ukuran:</span>
              <button
                onClick={() => setFontSize('text-sm')}
                className={`px-2 py-1 rounded-lg font-bold ${fontSize === 'text-sm' ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('text-base')}
                className={`px-2 py-1 rounded-lg font-bold ${fontSize === 'text-base' ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('text-lg')}
                className={`px-2 py-1 rounded-lg font-bold ${fontSize === 'text-lg' ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
              >
                A+
              </button>
            </div>

            {/* Tombol Tuntas Belajar */}
            <button
              onClick={() => handleToggleRead(detailMateri.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isCompleted
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-blue-600 text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Check className="w-4 h-4" />
              {isCompleted ? 'Selesai Dibaca' : 'Tandai Selesai'}
            </button>
          </div>
        </div>

        {/* Konten Utama Pembaca Materi */}
        <article className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-6">
          
          {/* Header Info Materi */}
          <div className="border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                PAI Kelas {detailMateri.kelas}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                Bab {detailMateri.bab}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold">
                {detailMateri.kategori}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              {detailMateri.judul}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {detailMateri.deskripsi}
            </p>
          </div>

          {/* Box Dalil Al-Qur'an / Hadis (Jika Ada) */}
          {detailMateri.ayat_arab && (
            <div className="rounded-2xl bg-gradient-to-br from-blue-50/80 to-cyan-50/80 border border-blue-200/80 p-5 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Dalil Naqli Al-Qur'an / Hadis Pilihan
                </span>
                <span className="text-[11px] font-semibold text-blue-700">Teks Arab & Terjemah</span>
              </div>

              {/* Teks Arab dengan tipografi kaligrafi */}
              <p className="font-arabic text-2xl sm:text-3xl text-slate-900 leading-loose text-right py-2">
                {detailMateri.ayat_arab}
              </p>

              {/* Terjemahan */}
              <div className="border-t border-blue-200/60 pt-3">
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{detailMateri.arti_ayat}"
                </p>
              </div>
            </div>
          )}

          {/* Isi Uraian Pembelajaran */}
          <div 
            className={`prose max-w-none text-slate-700 leading-relaxed ${fontSize}`}
            dangerouslySetInnerHTML={{ __html: detailMateri.konten }}
          />

          {/* Rujukan & Sumber */}
          {detailMateri.rujukan && (
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Rujukan: {detailMateri.rujukan}</span>
            </div>
          )}

        </article>

      </div>
    );
  }

  // Tampilan Katalog Materi per Bab
  return (
    <div className="space-y-6 pb-24 md:pb-8">
      
      {/* Header Halaman & Filter Kelas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-700" />
            Modul Materi Pembelajaran PAI
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kurikulum Terpadu Pendidikan Agama Islam & Budi Pekerti jenjang SMP/MTs.
          </p>
        </div>

        {/* Tab Pilihan Jenjang Kelas 7, 8, 9 */}
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

      {/* Bar Pencarian & Filter Kategori */}
      <div className="space-y-3">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari materi PAI (contoh: Asmaul Husna, Sujud, Lingkungan, Kiamat)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>

        {/* Kategori Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Grid Kartu Materi */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
          Memuat daftar materi PAI Kelas {activeKelas}...
        </div>
      ) : materiList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materiList.map((m) => {
            const isCompleted = readMateriIds.includes(m.id);
            return (
              <div
                key={m.id}
                onClick={() => handleOpenDetail(m)}
                className="group p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                      Bab {m.bab}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {m.kategori}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {m.judul}
                  </h3>

                  {m.ayat_arab && (
                    <p className="font-arabic text-right text-base text-blue-800 my-2 line-clamp-1">
                      {m.ayat_arab}
                    </p>
                  )}

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {m.deskripsi}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {isCompleted ? (
                      <span className="text-blue-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selesai Dibaca
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <BookMarked className="w-3.5 h-3.5" /> Belum Dibaca
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                    Buka Bab <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          Tidak ada materi yang sesuai dengan pencarian atau filter yang dipilih.
        </div>
      )}

    </div>
  );
}
