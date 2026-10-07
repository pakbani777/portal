import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchNilai, createMateri, createPengumuman, createTugas, createUlangan, fetchUlanganList } from '../services/api';
import { Settings, PlusCircle, Download, Send, ShieldCheck } from 'lucide-react';
import { sounds } from '../components/AudioCues';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UserManagement from '../components/UserManagement';

export default function GuruAdminPage() {
  const { activeKelas, setActiveKelas, showToast } = useApp();
  const [nilaiList, setNilaiList] = useState([]);
  const [ulanganList, setUlanganList] = useState([]);
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
      .catch((err) => console.error(err));
      
    fetchUlanganList(activeKelas)
      .then((res) => {
        if (res.success) setUlanganList(res.data);
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

  const [activeAdminTab, setActiveAdminTab] = useState(() => {
    return localStorage.getItem('portal_admin_tab') || 'materi_nilai';
  });

  useEffect(() => {
    localStorage.setItem('portal_admin_tab', activeAdminTab);
  }, [activeAdminTab]);

  const [formTugas, setFormTugas] = useState({ judul: '', deskripsi: '', deadline: '', kelas: activeKelas, link_tugas: '' });
  const [submittingTugas, setSubmittingTugas] = useState(false);
  
  const handleTugasSubmit = async (e) => {
    e.preventDefault();
    if (!formTugas.judul || !formTugas.deskripsi || !formTugas.deadline || !formTugas.link_tugas) return showToast('Semua kolom tugas harus diisi termasuk link tugas');
    setSubmittingTugas(true);
    try {
      const res = await createTugas({ ...formTugas, kelas: activeKelas });
      if (res.success) {
        showToast('Tugas berhasil dibuat!');
        setFormTugas({ judul: '', deskripsi: '', deadline: '', kelas: activeKelas, link_tugas: '' });
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
  
  const [formUlangan, setFormUlangan] = useState({
    judul: '',
    jenis: 'UH',
    durasi_menit: 60,
    token_ujian: 'CBT123'
  });
  const [soalList, setSoalList] = useState([
    { id: 'q1', pertanyaan: '', pilihan: ['', '', '', ''], kunci: 0, bobot: 1 }
  ]);
  const [submittingUlangan, setSubmittingUlangan] = useState(false);

  
  const [showMassInput, setShowMassInput] = useState(false);
  const [massText, setMassText] = useState('');

  const handleParseMassal = () => {
    if (!massText.trim()) return showToast('Teks kosong!');
    
    const blocks = massText.split(/\n(?=\d+\.)/).map(b => b.trim()).filter(b => b);
    const newSoalArray = [];
    
    for (let i = 0; i < blocks.length; i++) {
      const lines = blocks[i].split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length < 5) continue;
      
      const qText = lines[0].replace(/^\d+\.\s*/, '');
      const opts = ['', '', '', ''];
      let kunciIdx = 0;
      let bobotVal = 1;
      
      let optCount = 0;
      for (let j = 1; j < lines.length; j++) {
        const lower = lines[j].toLowerCase();
        if (lower.startsWith('a.') || lower.startsWith('a)')) { opts[0] = lines[j].substring(2).trim(); optCount++; }
        else if (lower.startsWith('b.') || lower.startsWith('b)')) { opts[1] = lines[j].substring(2).trim(); optCount++; }
        else if (lower.startsWith('c.') || lower.startsWith('c)')) { opts[2] = lines[j].substring(2).trim(); optCount++; }
        else if (lower.startsWith('d.') || lower.startsWith('d)')) { opts[3] = lines[j].substring(2).trim(); optCount++; }
        else if (lower.startsWith('kunci:')) {
          const kStr = lower.replace('kunci:', '').trim();
          if (kStr === 'a') kunciIdx = 0;
          if (kStr === 'b') kunciIdx = 1;
          if (kStr === 'c') kunciIdx = 2;
          if (kStr === 'd') kunciIdx = 3;
        }
        else if (lower.startsWith('bobot:')) {
          const bVal = parseInt(lower.replace('bobot:', '').trim());
          if (!isNaN(bVal)) bobotVal = bVal;
        }
      }
      
      newSoalArray.push({
        id: 'qm' + Date.now() + i,
        pertanyaan: qText,
        pilihan: opts,
        kunci: kunciIdx,
        bobot: bobotVal
      });
    }
    
    if (newSoalArray.length > 0) {
      setSoalList(newSoalArray);
      setShowMassInput(false);
      setMassText('');
      showToast(`Berhasil memproses ${newSoalArray.length} soal!`);
      sounds.playSuccess();
    } else {
      showToast('Gagal memproses teks. Pastikan format benar.', 'error');
    }
  };

  const handleAddSoal = () => {
    sounds.playClick();
    setSoalList([...soalList, { id: 'q' + Date.now(), pertanyaan: '', pilihan: ['', '', '', ''], kunci: 0, bobot: 1 }]);
  };
  const handleRemoveSoal = (idx) => {
    sounds.playClick();
    const newSoal = [...soalList];
    newSoal.splice(idx, 1);
    setSoalList(newSoal);
  };
  const handleSoalChange = (idx, field, value) => {
    const newSoal = [...soalList];
    newSoal[idx][field] = value;
    setSoalList(newSoal);
  };
  const handlePilihanChange = (soalIdx, pilIdx, value) => {
    const newSoal = [...soalList];
    newSoal[soalIdx].pilihan[pilIdx] = value;
    setSoalList(newSoal);
  };
  const handleUlanganSubmit = async (e) => {
    e.preventDefault();
    if (!formUlangan.judul || !formUlangan.token_ujian) return showToast('Judul dan Token wajib diisi');
    
    // validate soal
    if (soalList.length === 0) return showToast('Minimal buat 1 soal');
    for (const s of soalList) {
      if (!s.pertanyaan || s.pilihan.some(p => !p.trim())) {
        return showToast('Pastikan semua pertanyaan dan pilihan jawaban terisi');
      }
    }
    
    setSubmittingUlangan(true);
    try {
      const res = await createUlangan({
        ...formUlangan,
        kelas: activeKelas,
        soal_json: soalList
      });
      if (res.success) {
        showToast('Ulangan CBT berhasil dijadwalkan!');
        sounds.playSuccess();
        setFormUlangan({ judul: '', jenis: 'UH', durasi_menit: 60, token_ujian: 'CBT123' });
        setSoalList([{ id: 'q1', pertanyaan: '', pilihan: ['', '', '', ''], kunci: 0, bobot: 1 }]);
      } else {
        showToast(res.message);
      }
    } catch (error) {
      showToast('Gagal membuat ulangan');
    }
    setSubmittingUlangan(false);
  };

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
            <button
              onClick={() => { sounds.playClick(); setActiveAdminTab('tugas'); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'tugas'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kelola Tugas
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveAdminTab('ulangan'); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'ulangan'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buat CBT
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

        {activeAdminTab === 'ulangan' && (
          <>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
              📝 Buat Ulangan CBT Baru
            </h2>
            <form onSubmit={handleUlanganSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Judul Ulangan</label>
                  <input type="text" value={formUlangan.judul} onChange={e => setFormUlangan({...formUlangan, judul: e.target.value})} placeholder="Contoh: Penilaian Harian Bab 1" className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis Evaluasi</label>
                  <select value={formUlangan.jenis} onChange={e => setFormUlangan({...formUlangan, jenis: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm cursor-pointer">
                    <option value="UH">Ulangan Harian (UH)</option>
                    <option value="PTS">Penilaian Tengah Semester (PTS)</option>
                    <option value="PAS">Penilaian Akhir Semester (PAS)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Target Kelas</label>
                  <input type="text" value={activeKelas} disabled className="w-full px-4 py-2 rounded-xl bg-slate-200 border border-slate-300 text-sm opacity-70" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Durasi (Menit)</label>
                  <input type="number" min="10" max="180" value={formUlangan.durasi_menit} onChange={e => setFormUlangan({...formUlangan, durasi_menit: parseInt(e.target.value) || 60})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Token Ujian (Akses CBT)</label>
                  <input type="text" value={formUlangan.token_ujian} onChange={e => setFormUlangan({...formUlangan, token_ujian: e.target.value.toUpperCase()})} placeholder="Contoh: PAI7X" className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono tracking-widest text-blue-700 font-bold uppercase" required />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800">Daftar Soal Pilihan Ganda</h3>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowMassInput(!showMassInput)} className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-200 transition cursor-pointer">
                      Input Massal (Teks)
                    </button>
                    <button type="button" onClick={handleAddSoal} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-200 transition flex items-center gap-1 cursor-pointer">
                      <PlusCircle className="w-4 h-4" /> Tambah Soal
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  
                {showMassInput && (
                  <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-2xl">
                    <h4 className="text-xs font-bold text-purple-800 mb-2">Format Input Massal:</h4>
                    <pre className="text-[10px] text-purple-700 bg-white p-2 rounded-lg mb-3 font-mono">
1. Pertanyaan pertama
A. Opsi A
B. Opsi B
C. Opsi C
D. Opsi D
Kunci: A
Bobot: 2
                    </pre>
                    <textarea 
                      rows="6" 
                      value={massText}
                      onChange={e => setMassText(e.target.value)}
                      placeholder="Paste soal di sini..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-purple-300 text-sm mb-2"
                    />
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setShowMassInput(false)} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Batal</button>
                      <button type="button" onClick={handleParseMassal} className="px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg">Proses Soal</button>
                    </div>
                  </div>
                )}
                {soalList.map((soal, sIdx) => (
                    <div key={soal.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative">
                      {soalList.length > 1 && (
                        <button type="button" onClick={() => handleRemoveSoal(sIdx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 cursor-pointer">
                          <Settings className="w-4 h-4 opacity-0" />
                          <span className="text-xs font-bold bg-red-100 px-2 py-1 rounded-md">Hapus</span>
                        </button>
                      )}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-bold text-slate-700">Soal No. {sIdx + 1}</label>
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] font-bold text-slate-500">Bobot Nilai:</label>
                            <input type="number" min="1" value={soal.bobot || 1} onChange={e => handleSoalChange(sIdx, 'bobot', parseInt(e.target.value) || 1)} className="w-14 px-2 py-0.5 rounded-md border text-xs text-center font-bold text-blue-700" />
                          </div>
                        </div>
                        <textarea rows="2" value={soal.pertanyaan} onChange={e => handleSoalChange(sIdx, 'pertanyaan', e.target.value)} placeholder="Tuliskan pertanyaan di sini..." className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm" required />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {soal.pilihan.map((pil, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name={`kunci-${soal.id}`} 
                              checked={soal.kunci === pIdx}
                              onChange={() => handleSoalChange(sIdx, 'kunci', pIdx)}
                              className="w-4 h-4 text-blue-600 cursor-pointer" 
                            />
                            <input 
                              type="text" 
                              value={pil}
                              onChange={e => handlePilihanChange(sIdx, pIdx, e.target.value)}
                              placeholder={`Opsi ${String.fromCharCode(65 + pIdx)}`} 
                              className={`w-full px-3 py-1.5 rounded-lg border text-sm ${soal.kunci === pIdx ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 bg-white'}`} 
                              required 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button type="submit" disabled={submittingUlangan} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl cursor-pointer hover:bg-blue-700 transition flex items-center gap-2 shadow-md">
                  <ShieldCheck className="w-4 h-4" /> {submittingUlangan ? 'Menyimpan...' : 'Jadwalkan CBT'}
                </button>
              </div>
            </form>
          </div>

          {/* DAFTAR CBT & HASIL NILAI */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in mt-6">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
              Daftar Ulangan CBT & Hasil Nilai (Kelas {activeKelas})
            </h2>
            {ulanganList.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">Belum ada ujian CBT untuk kelas ini.</div>
            ) : (
              <div className="space-y-6">
                {ulanganList.map(u => {
                  const ulanganNilai = nilaiList.filter(n => n.tipe === 'ulangan' && n.ref_id === u.id);
                  return (
                    <div key={u.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{u.judul}</h3>
                          <p className="text-xs text-slate-500">Token: <span className="font-mono font-bold text-blue-700">{u.token_ujian}</span> | Durasi: {u.durasi_menit} menit</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-full">
                          {ulanganNilai.length} Siswa Mengerjakan
                        </span>
                      </div>
                      
                      {ulanganNilai.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs bg-white border border-slate-100 rounded-lg overflow-hidden">
                            <thead className="bg-slate-100 text-slate-500">
                              <tr>
                                <th className="py-2 px-3">Nama Siswa</th>
                                <th className="py-2 px-3 text-center">Benar</th>
                                <th className="py-2 px-3 text-center">Total Soal</th>
                                <th className="py-2 px-3 text-center">Skor (0-100)</th>
                                <th className="py-2 px-3 text-right">Waktu Selesai</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {ulanganNilai.map(n => (
                                <tr key={n.id} className="hover:bg-slate-50/50">
                                  <td className="py-2 px-3 font-semibold text-slate-700">{n.nama_siswa}</td>
                                  <td className="py-2 px-3 text-center">{n.jawaban_benar}</td>
                                  <td className="py-2 px-3 text-center">{n.total_soal}</td>
                                  <td className="py-2 px-3 text-center font-bold text-blue-700">{n.skor}</td>
                                  <td className="py-2 px-3 text-right text-[10px] text-slate-400">{n.waktu_selesai}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Belum ada siswa yang mengerjakan CBT ini.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          </>
        )}

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


