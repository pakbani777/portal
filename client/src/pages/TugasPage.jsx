import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchTugas, submitTugas } from '../services/api';
import { ClipboardList, Clock, Upload, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import { sounds } from '../components/AudioCues';

export default function TugasPage() {
  const { activeKelas, currentUser, showToast, isMobile } = useApp();
  const [tugasList, setTugasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTugas, setSelectedTugas] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTugas();
  }, [activeKelas]);

  const loadTugas = async () => {
    setLoading(true);
    try {
      const res = await fetchTugas(activeKelas);
      if (res.success) setTugasList(res.data);
    } catch (error) {
      showToast('Gagal memuat daftar tugas');
    }
    setLoading(false);
  };

  const handleUploadClick = (tugas) => {
    sounds.playClick();
    setSelectedTugas(tugas);
    setFileUrl('');
    setCatatan('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl.trim()) return showToast('Link file tidak boleh kosong!');
    
    setSubmitting(true);
    try {
      const res = await submitTugas(selectedTugas.id, {
        nama_siswa: currentUser?.nama,
        kelas: activeKelas,
        file_url: fileUrl,
        catatan: catatan
      });
      if (res.success) {
        showToast('Tugas berhasil dikumpulkan!');
        sounds.playSuccess();
        setSelectedTugas(null);
      } else {
        showToast(res.message);
      }
    } catch (err) {
      showToast('Terjadi kesalahan saat mengumpulkan tugas');
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-blue-200" /> Pengumpulan Tugas
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
            Daftar tugas PAI untuk Kelas {activeKelas}. Kumpulkan tepat waktu!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400 font-medium">Memuat tugas...</div>
        ) : tugasList.length > 0 ? (
          tugasList.map((tugas) => (
            <div key={tugas.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  Kelas {tugas.kelas}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                  <Clock className="w-3 h-3" /> {tugas.deadline ? new Date(tugas.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{tugas.judul}</h3>
              <p className="text-xs text-slate-600 mb-4 line-clamp-3">{tugas.deskripsi}</p>
              
              <div className="mt-auto">
                
                  <a
                    href={tugas.link_tugas || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sounds.playClick()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Kumpulkan Tugas
                  </a>

              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">Belum Ada Tugas</h3>
            <p className="text-xs text-slate-500">Tidak ada tugas yang ditugaskan untuk kelas ini saat ini.</p>
          </div>
        )}
      </div>

      

    </div>
  );
}
