import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchNilai, createMateri, createPengumuman, createTugas } from '../services/api';
import { Settings, PlusCircle, Download, Send, ShieldCheck } from 'lucide-react';
import { sounds } from '../components/AudioCues';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UserManagement from '../components/UserManagement';

export default function GuruAdminPage() {
  const { activeKelas, setActiveKelas, showToast } = useApp();
  const [nilaiList, setNilaiList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Tambah Materi oleh Pak Bani
  const [formMateri, setFormMateri] = useState({
    kelas: activeKelas,
    bab: '',
    judul: '',
    kategori: 'Al-Qur\'an & Hadis',
    ayat_arab: '',
    arti_ayat: '',
    deskripsi: '',
    konten: '',
    rujukan: ''
  });
  const [submittingMateri, setSubmittingMateri] = useState(false);

  const loadNilai = () => {
    setLoading(true);
    fetchNilai('', activeKelas)
      .then((res) => {
        if (res.success) setNilaiList(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNilai();
  }, [activeKelas]);

  const handleCreateMateriSubmit = async (e) => {
    e.preventDefault();
    sounds.playClick();
    setSubmittingMateri(true);

    try {
      const res = await createMateri({
        ...formMateri,
        kelas: Number(formMateri.kelas),
        bab: Number(formMateri.bab)
      });

      if (res.success) {
        sounds.playSuccess();
        showToast('Materi PAI berhasil diterbitkan oleh Pak Bani!');
        setFormMateri({
          kelas: activeKelas,
          bab: '',
          judul: '',
          kategori: 'Al-Qur\'an & Hadis',
          ayat_arab: '',
          arti_ayat: '',
          deskripsi: '',
          konten: '',
          rujukan: ''
        });
      } else {
        sounds.playError();
        showToast(res.message, 'error');
      }
    } catch (err) {
      sounds.playError();
      showToast('Gagal menambahkan materi', 'error');
    } finally {
      setSubmittingMateri(false);
    }
  };

  const handleExportNilaiCSV = () => {
    sounds.playClick();
    if (nilaiList.length === 0) {
      showToast('Tidak ada data nilai untuk diekspor', 'error');
      return;
    }

    const headers = ['No', 'Tipe Asesmen', 'Nama Siswa', 'Kelas', 'Skor', 'Jawaban Benar', 'Total Soal', 'Waktu Pengumpulan'];
    const rows = nilaiList.map((n, i) => [
      i + 1,
      n.tipe.toUpperCase(),
      `"${n.nama_siswa}"`,
      n.kelas,
      n.skor,
      n.jawaban_benar,
      n.total_soal,
      `"${n.waktu_selesai}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_PAI_PakBani_Kelas_${activeKelas}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Buku nilai siswa berhasil diunduh! 📊');
  };

  const [activeAdminTab, setActiveAdminTab] = useState('materi_nilai');

  const [formTugas, setFormTugas] = useState({ judul: '', deskripsi: '', deadline: '', kelas: activeKelas });
  const [submittingTugas, setSubmittingTugas] = useState(false);
  
  const handleTugasSubmit = async (e) => {
    e.preventDefault();
    if (!formTugas.judul || !formTugas.deskripsi || !formTugas.deadline) return showToast('Semua kolom tugas harus diisi');
    setSubmittingTugas(true);
    try {
      const res = await createTugas({ ...formTugas, kelas: activeKelas });
      if (res.success) {
        showToast('Tugas berhasil dibuat!');
        setFormTugas({ judul: '', deskripsi: '', deadline: '', kelas: activeKelas });
      } else {
        showToast(res.message);
      }
    } catch (e) {
      showToast('Gagal membuat tugas');
    }
    setSubmittingTugas(false);
  };


  const [formPengumuman, setFormPengumuman] = useState({ judul: '', isi: '', tipe: 'info' });
  const [submittingPengumuman, setSubmittingPengumuman] = useState(false);
  const handlePengumumanSubmit = async (e) => {
    e.preventDefault();
    if (!formPengumuman.judul || !formPengumuman.isi) return showToast('Judul dan Isi harus diisi');
    setSubmittingPengumuman(true);
    try {
      const res = await createPengumuman(formPengumuman);
      if (res.success) {
        showToast('Pengumuman berhasil diterbitkan!');
        setFormPengumuman({ judul: '', isi: '', tipe: 'info' });
      } else {
        showToast(res.message);
      }
    } catch (e) {
      showToast('Gagal menerbitkan pengumuman');
    }
    setSubmittingPengumuman(false);
  };


  return (
    <div className="space-y-6 pb-24 md:pb-8">
      
      {/* Header Halaman Panel Guru */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-600" />
            Panel Pengelolaan Pak Bani
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Buku rekapitulasi nilai ujian siswa dan input bahan ajar materi PAI Kelas {activeKelas}.
          </p>
        </div>

        {/* Tab Navigasi Admin */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => { sounds.playClick(); setActiveAdminTab('materi_nilai'); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeAdminTab === 'materi_nilai'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Materi & Nilai
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveAdminTab('users'); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeAdminTab === 'users'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pengguna
          </button>
        </div>
      </div>

      {activeAdminTab === 'materi_nilai' && (
      <div className="space-y-4">
        {/* Filter Kelas */}
        <div className="flex items-center justify-end">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {['7', '8', '9'].map((kls) => (
              <button
                key={kls}
                onClick={() => {
                  sounds.playClick();
                  setActiveKelas(kls);
                  setFormMateri(prev => ({ ...prev, kelas: kls }));
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeKelas === kls
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kelas {kls}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Form Tambah Materi PAI Baru */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <PlusCircle className="w-5 h-5 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Terbitkan Materi PAI Baru
              </h2>
            </div>

            <form onSubmit={handleCreateMateriSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Jenjang Kelas
                  </label>
                  <select
                    value={formMateri.kelas}
                    onChange={(e) => setFormMateri({ ...formMateri, kelas: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="7">Kelas 7</option>
                    <option value="8">Kelas 8</option>
                    <option value="9">Kelas 9</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Bab ke-
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Contoh: 6"
                    value={formMateri.bab}
                    onChange={(e) => setFormMateri({ ...formMateri, bab: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Kategori Materi
                </label>
                <select
                  value={formMateri.kategori}
                  onChange={(e) => setFormMateri({ ...formMateri, kategori: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden"
                >
                  <option value="Al-Qur'an & Hadis">Al-Qur'an & Hadis</option>
                  <option value="Akidah">Akidah</option>
                  <option value="Akhlak">Akhlak</option>
                  <option value="Pendidikan Anti Korupsi (PAK)">Pendidikan Anti Korupsi (PAK)</option>
                  <option value="Fiqih Ibadah">Fiqih Ibadah</option>
                  <option value="Sejarah Kebudayaan Islam">Sejarah Kebudayaan Islam</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Judul Bab Materi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Meneladani Sifat Amanah Para Sahabat"
                  value={formMateri.judul}
                  onChange={(e) => setFormMateri({ ...formMateri, judul: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Potongan Ayat Arab (Opsional)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  placeholder="Contoh: إِنَّ اللَّهَ مَعَ الصَّابِرِينَ"
                  value={formMateri.ayat_arab}
                  onChange={(e) => setFormMateri({ ...formMateri, ayat_arab: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-arabic text-slate-800 focus:outline-hidden text-right"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Arti Terjemahan Ayat
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sungguh Allah bersama orang yang sabar"
                  value={formMateri.arti_ayat}
                  onChange={(e) => setFormMateri({ ...formMateri, arti_ayat: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden"
                />
              </div>

              <div className="quill-container">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Isi Lengkap Bahan Ajar
                </label>
                <ReactQuill
                  theme="snow"
                  value={formMateri.konten}
                  onChange={(content) => setFormMateri({ ...formMateri, konten: content })}
                  className="bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Tulis uraian materi pembahasan di sini..."
                />
              </div>

              <button
                type="submit"
                disabled={submittingMateri}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {submittingMateri ? 'Menyimpan...' : 'Terbitkan Materi PAI'}
              </button>
            </form>
          </div>
        </div>

        {/* Kolom Kanan: Rekap Buku Nilai Siswa */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Buku Rekapitulasi Nilai Siswa (Kelas {activeKelas})
                </h2>
                <p className="text-[11px] text-slate-400">
                  Hasil pengerjaan Kuis Interaktif dan Ulangan CBT oleh siswa
                </p>
              </div>

              <button
                onClick={handleExportNilaiCSV}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Nilai CSV</span>
              </button>
            </div>

            {/* Tabel Nilai */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-3">Tipe Asesmen</th>
                    <th className="py-2.5 px-3">Skor</th>
                    <th className="py-2.5 px-3">Status KKM</th>
                    <th className="py-2.5 px-3">Waktu Selesai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Memuat rekap nilai...
                      </td>
                    </tr>
                  ) : nilaiList.length > 0 ? (
                    nilaiList.map((row) => {
                      const tuntas = row.skor >= 75;
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900">
                            {row.nama_siswa}
                            <span className="block text-[10px] text-slate-400 font-normal">
                              Kelas {row.kelas}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                                row.tipe === 'ulangan'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {row.tipe.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono font-extrabold text-slate-900 text-sm">
                            {row.skor}
                            <span className="text-[10px] text-slate-400 font-normal">
                              {' '}({row.jawaban_benar}/{row.total_soal} benar)
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                tuntas
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {tuntas ? 'Tuntas' : 'Remedial'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-medium text-[11px]">
                            {row.waktu_selesai}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Belum ada riwayat pengerjaan nilai untuk kelas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
      </div>
      )}
      {activeAdminTab === 'users' && <UserManagement />}

        {activeAdminTab === 'tugas' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
              📝 Buat Tugas Baru
            </h2>
            <form onSubmit={handleTugasSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Judul Tugas</label>
                <input type="text" value={formTugas.judul} onChange={e => setFormTugas({...formTugas, judul: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Batas Waktu (Deadline)</label>
                  <input type="datetime-local" value={formTugas.deadline} onChange={e => setFormTugas({...formTugas, deadline: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Target Kelas</label>
                  <input type="text" value={activeKelas} disabled className="w-full px-4 py-2 rounded-xl bg-slate-200 border border-slate-300 text-sm opacity-70" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi / Instruksi Tugas</label>
                <textarea rows="4" value={formTugas.deskripsi} onChange={e => setFormTugas({...formTugas, deskripsi: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm" required />
              </div>
              <button type="submit" disabled={submittingTugas} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl cursor-pointer">
                {submittingTugas ? 'Membuat...' : 'Terbitkan Tugas'}
              </button>
            </form>
          </div>
        )}

    </div>
  );
}


