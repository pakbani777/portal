import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchUlanganList, fetchUlanganDetail, submitUlangan } from '../services/api';
import { FileSpreadsheet, KeyRound, Clock, AlertTriangle, CheckCircle2, Award, Printer, ArrowRight, ArrowLeft, ShieldAlert, Check } from 'lucide-react';
import { sounds } from '../components/AudioCues';

export default function UlanganPage() {
  const { activeKelas, setActiveKelas, currentUser, showToast, activeUlanganId, setActiveUlanganId } = useApp();

  const [ulanganList, setUlanganList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Token
  const [targetUlangan, setTargetUlangan] = useState(null);
  const [inputToken, setInputToken] = useState('');
  const [tokenError, setTokenError] = useState('');

  // Sesi CBT Aktif
  const [activeExam, setActiveExam] = useState(null);
  const [currentNo, setCurrentNo] = useState(0); // 0-based index
  const [jawabanCbt, setJawabanCbt] = useState({}); // { [soalId]: opsiIdx }
  const [raguRagu, setRaguRagu] = useState({}); // { [soalId]: boolean }
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasilCbt, setHasilCbt] = useState(null);

  // Fetch daftar ulangan
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchUlanganList(activeKelas, currentUser?.nama)
      .then((res) => {
        if (isMounted && res.success) setUlanganList(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeKelas]);

  // Timer hitung mundur CBT
  useEffect(() => {
    if (!activeExam || hasilCbt) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleForceSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, hasilCbt]);

  const handleOpenTokenModal = (u) => {
    sounds.playClick();
    setTargetUlangan(u);
    setInputToken('');
    setTokenError('');
  };

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    if (!targetUlangan) return;

    if (inputToken.trim().toUpperCase() !== targetUlangan.token_ujian.toUpperCase()) {
      sounds.playError();
      setTokenError(`Token salah! Token yang berlaku untuk ujian ini adalah: ${targetUlangan.token_ujian}`);
      return;
    }

    sounds.playSuccess();
    setLoading(true);
    try {
      const res = await fetchUlanganDetail(targetUlangan.id);
      if (res.success) {
        setActiveExam(res.data);
        setCurrentNo(0);
        setJawabanCbt({});
        setRaguRagu({});
        setTimeLeft(res.data.durasi_menit * 60);
        setHasilCbt(null);
        setTargetUlangan(null);
        showToast('Token valid! Ujian CBT dimulai. Bismillah...');
      }
    } catch (err) {
      showToast('Gagal memuat soal ujian', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (soalId, optIdx) => {
    sounds.playClick();
    setJawabanCbt((prev) => ({
      ...prev,
      [soalId]: optIdx
    }));
  };

  const handleToggleRagu = (soalId) => {
    sounds.playClick();
    setRaguRagu((prev) => ({
      ...prev,
      [soalId]: !prev[soalId]
    }));
  };

  const handleForceSubmit = () => {
    showToast('Waktu ujian telah habis! Jawaban otomatis dikumpulkan.', 'error');
    handleDoSubmit();
  };

  const handleDoSubmit = async () => {
    if (!activeExam) return;
    setSubmitting(true);
    setShowConfirmModal(false);

    try {
      const res = await submitUlangan({
        ulangan_id: activeExam.id,
        nama_siswa: currentUser.nama,
        kelas: activeKelas,
        jawaban: jawabanCbt
      });

      if (res.success) {
        sounds.playSuccess();
        setHasilCbt(res.data);
        showToast('Alhamdulillah, ulangan CBT berhasil dikumpulkan!');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      showToast('Gagal mengirim jawaban ulangan', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- 1. TAMPILAN KARTU SERTIFIKAT HASIL CBT ---
  if (hasilCbt) {
    const isLulus = hasilCbt.skor >= 75;
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-24 md:pb-8">
        
        {/* Card Sertifikat / Hasil Nilai */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-slate-200 shadow-xl text-center space-y-6">
          
          <div className="border-b border-slate-100 pb-5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
              Laporan Hasil Asesmen CBT
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              {hasilCbt.judul}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Mata Pelajaran: Pendidikan Agama Islam & Budi Pekerti
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <p className="text-slate-400 font-semibold">Nama Peserta Didik</p>
              <p className="font-extrabold text-slate-900">{currentUser.nama}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold">Jenjang & Kelas</p>
              <p className="font-extrabold text-slate-900">Kelas {activeKelas} SMP/MTs</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold">Waktu Pengumpulan</p>
              <p className="font-bold text-slate-700">{hasilCbt.waktuSelesai}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold">Kriteria Ketuntasan (KKM)</p>
              <p className="font-bold text-slate-700">75 (Skala 100)</p>
            </div>
          </div>

          {/* Skor Angka Utama */}
          <div className="py-4">
            <div className="text-6xl sm:text-7xl font-black text-blue-800 tracking-tight">
              {hasilCbt.skor}
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-extrabold ${
                  isLulus
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isLulus ? 'TUNTAS / LULUS' : 'BELUM TUNTAS'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-around border-t border-slate-100 pt-4 text-xs text-slate-600">
            <div>
              <span className="block text-slate-400 font-medium">Soal Benar</span>
              <strong className="text-blue-700 text-base">{hasilCbt.jawabanBenar}</strong>
            </div>
            <div className="border-r border-slate-200 h-8" />
            <div>
              <span className="block text-slate-400 font-medium">Soal Salah</span>
              <strong className="text-rose-600 text-base">{hasilCbt.totalSoal - hasilCbt.jawabanBenar}</strong>
            </div>
            <div className="border-r border-slate-200 h-8" />
            <div>
              <span className="block text-slate-400 font-medium">Total Soal</span>
              <strong className="text-slate-800 text-base">{hasilCbt.totalSoal}</strong>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Cetak Hasil
            </button>
            <button
              onClick={() => {
                setActiveExam(null);
                setHasilCbt(null);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Selesai & Keluar
            </button>
          </div>

        </div>

      </div>
    );
  }

  // --- 2. TAMPILAN ARENA UJIAN CBT FOKUS ---
  if (activeExam) {
    const totalSoal = activeExam.soal.length;
    const currentSoal = activeExam.soal[currentNo];
    const isRagu = raguRagu[currentSoal.id];
    const userChoice = jawabanCbt[currentSoal.id];

    // Hitung statistik progres
    const totalTerjawab = Object.keys(jawabanCbt).length;

    return (
      <div className="space-y-6 pb-24 md:pb-8">
        
        {/* CBT Sticky Header: Judul Ujian, Timer & Tombol Selesai */}
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-md flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-1">
              {activeExam.judul}
            </h2>
            <p className="text-[10px] text-slate-500">
              Peserta: {currentUser.nama} (Kelas {activeKelas})
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer Counter */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-black shadow-xs ${
                timeLeft < 300
                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                  : 'bg-slate-900 text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
            >
              Kumpulkan
            </button>
          </div>
        </div>

        {/* Layout CBT Dua Kolom: Soal Utama & Lembar Navigasi Nomor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom Soal Utama (Kiri) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-extrabold px-3 py-1 rounded-lg bg-slate-100 text-slate-800">
                  Nomor Soal: {currentNo + 1}
                </span>
                <button
                  onClick={() => handleToggleRagu(currentSoal.id)}
                  className={`text-xs font-bold px-3 py-1 rounded-xl transition-all cursor-pointer border ${
                    isRagu
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-50'
                  }`}
                >
                  {isRagu ? '★ Ragu-ragu (Ditandai)' : 'Tandai Ragu-ragu'}
                </button>
              </div>

              {/* Teks Pertanyaan */}
              <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {currentSoal.pertanyaan}
              </p>

              {/* Opsi Pilihan Jawaban */}
              <div className="space-y-3">
                {currentSoal.pilihan.map((opsi, optIdx) => {
                  const isSelected = userChoice === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentSoal.id, optIdx)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all border flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 text-blue-950 border-blue-500 ring-2 ring-blue-500/20'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opsi}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Navigasi Bawah */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (currentNo > 0) setCurrentNo(c => c - 1);
                  }}
                  disabled={currentNo === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Sebelumnya
                </button>

                {currentNo < totalSoal - 1 ? (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setCurrentNo(c => c + 1);
                    }}
                    className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    Berikutnya <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md flex items-center gap-1 cursor-pointer"
                  >
                    Selesai Ujian
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Kolom Panel Navigasi Nomor Soal (Kanan) */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-md space-y-4">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Navigasi Nomor Soal ({totalTerjawab}/{totalSoal})
              </h3>

              {/* Grid Tombol Nomor Soal */}
              <div className="grid grid-cols-5 gap-2">
                {activeExam.soal.map((s, idx) => {
                  const answered = jawabanCbt[s.id] !== undefined;
                  const ragu = raguRagu[s.id];
                  const isCurrent = currentNo === idx;

                  let colorClass = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (ragu) {
                    colorClass = 'bg-amber-400 text-slate-900 border-amber-500 font-bold';
                  } else if (answered) {
                    colorClass = 'bg-blue-600 text-white border-blue-600 font-bold';
                  }

                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        sounds.playClick();
                        setCurrentNo(idx);
                      }}
                      className={`h-10 rounded-xl text-xs font-bold border transition-all flex items-center justify-center cursor-pointer ${colorClass} ${
                        isCurrent ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Keterangan Status Warna */}
              <div className="pt-3 border-t border-slate-100 text-[11px] space-y-1.5 text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600" />
                  <span>Sudah Terjawab</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span>Ragu-ragu</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300" />
                  <span>Belum Terjawab</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Konfirmasi Pengumpulan Ujian */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              
              <div className="text-center">
                <h3 className="text-base font-extrabold text-slate-900">
                  Konfirmasi Pengumpulan Ujian
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Anda telah menjawab <strong>{totalTerjawab}</strong> dari <strong>{totalSoal}</strong> butir soal.
                  {totalTerjawab < totalSoal && (
                    <span className="block text-rose-600 font-semibold mt-1">
                      Peringatan: Masih terdapat {totalSoal - totalTerjawab} soal yang belum Anda jawab!
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                >
                  Kembali Cek Soal
                </button>
                <button
                  onClick={handleDoSubmit}
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  {submitting ? 'Mengumpulkan...' : 'Ya, Kumpulkan'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // --- 3. TAMPILAN DAFTAR PAKET ULANGAN & MODAL TOKEN ---
  return (
    <div className="space-y-6 pb-24 md:pb-8">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-700" />
            Ulangan Online & Asesmen CBT
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Penilaian Tengah Semester (PTS) dan Ulangan Harian terstruktur PAI Kelas {activeKelas}.
          </p>
        </div>

        {/* Filter Kelas */}
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

      {/* Grid Paket Ulangan */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
          Memuat jadwal ulangan CBT...
        </div>
      ) : ulanganList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ulanganList.map((u) => (
            <div
              key={u.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      u.jenis === 'PTS'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {u.jenis === 'PTS' ? 'Penilaian Tengah Semester' : 'Ulangan Harian'}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {u.durasi_menit} Menit
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {u.judul}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  10 Butir Soal Terstandar Asesmen PAI Kemendikbud
                </p>

                {/* Info Token Bocoran Demo */}
                <div className="mt-3 p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-800 flex items-center justify-between">
                  <span>Token Ujian Kelas: <strong className="font-mono font-bold">{u.token_ujian}</strong></span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => handleOpenTokenModal(u)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-800/20 transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Masukkan Token Ujian
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          Belum ada jadwal ulangan CBT untuk kelas ini.
        </div>
      )}

      {/* Modal Input Token Ujian */}
      {targetUlangan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-extrabold text-slate-900">
                Verifikasi Token Ujian CBT
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {targetUlangan.judul}
              </p>
            </div>

            <form onSubmit={handleVerifyToken} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Masukkan Token Ujian
                </label>
                <input
                  type="text"
                  required
                  placeholder={`Contoh: ${targetUlangan.token_ujian}`}
                  value={inputToken}
                  onChange={(e) => {
                    setInputToken(e.target.value.toUpperCase());
                    setTokenError('');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono font-bold text-sm tracking-wider uppercase text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                {tokenError && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1 text-center">
                    {tokenError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTargetUlangan(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Mulai Ujian CBT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
