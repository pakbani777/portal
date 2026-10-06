import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchKuisList, fetchKuisDetail, submitKuis } from '../services/api';
import { Award, Clock, HelpCircle, CheckCircle2, XCircle, RotateCcw, ArrowRight, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import { sounds } from '../components/AudioCues';

export default function KuisPage() {
  const { activeKelas, setActiveKelas, currentUser, showToast, activeKuisId, setActiveKuisId } = useApp();
  const [kuisList, setKuisList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Quiz State
  const [activeKuis, setActiveKuis] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jawabanUser, setJawabanUser] = useState({}); // { [soalId]: optionIndex }
  const [hasilKuis, setHasilKuis] = useState(null);
  const [kuisSubmitting, setKuisSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchKuisList(activeKelas)
      .then((res) => {
        if (isMounted && res.success) setKuisList(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeKelas]);

  // Load Kuis Detail jika activeKuisId dipilih
  useEffect(() => {
    if (activeKuisId) {
      setLoading(true);
      fetchKuisDetail(activeKuisId)
        .then((res) => {
          if (res.success) {
            setActiveKuis(res.data);
            setCurrentIndex(0);
            setJawabanUser({});
            setHasilKuis(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setActiveKuis(null);
      setHasilKuis(null);
    }
  }, [activeKuisId]);

  const handleStartKuis = (kuis) => {
    sounds.playClick();
    setActiveKuisId(kuis.id);
  };

  const handlePilihJawaban = (soalId, opsiIndex) => {
    sounds.playClick();
    setJawabanUser((prev) => ({
      ...prev,
      [soalId]: opsiIndex
    }));
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (activeKuis && currentIndex < activeKuis.soal.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    sounds.playClick();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitKuis = async () => {
    if (!activeKuis) return;
    sounds.playClick();
    setKuisSubmitting(true);

    try {
      const res = await submitKuis({
        kuis_id: activeKuis.id,
        nama_siswa: currentUser.nama,
        kelas: activeKelas,
        jawaban: jawabanUser
      });

      if (res.success) {
        if (res.data.skor >= 75) {
          sounds.playSuccess();
        } else {
          sounds.playError();
        }
        setHasilKuis(res.data);
        showToast('Kuis berhasil diselesaikan!');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      showToast('Gagal mengirim jawaban kuis', 'error');
    } finally {
      setKuisSubmitting(false);
    }
  };

  const handleResetKuis = () => {
    sounds.playClick();
    setHasilKuis(null);
    setJawabanUser({});
    setCurrentIndex(0);
  };

  // --- 1. TAMPILAN ARENA PENGERJAAN KUIS / HASIL ---
  if (activeKuis) {
    // A. JIKA SUDAH SELESAI & ADA HASIL SKOR
    if (hasilKuis) {
      return (
        <div className="max-w-2xl mx-auto space-y-6 pb-24 md:pb-8">
          
          {/* Card Hasil Skor */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg text-center space-y-4">
            <div className="w-16 h-16 rounded-full mx-auto bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Hasil Latihan Kuis
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {activeKuis.judul}
              </h2>
            </div>

            {/* Skor Angka Besar */}
            <div className="py-4">
              <span className="text-5xl sm:text-6xl font-black text-blue-700 tracking-tight">
                {hasilKuis.skor}
              </span>
              <span className="text-sm font-bold text-slate-400 block mt-1">
                dari 100 poin
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-700 bg-blue-50 py-2.5 px-4 rounded-2xl border border-blue-100">
              {hasilKuis.pesan}
            </p>

            <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-2">
              <span>Benar: <strong className="text-blue-600 font-bold">{hasilKuis.jawabanBenar}</strong> soal</span>
              <span>Total: <strong className="text-slate-800 font-bold">{hasilKuis.totalSoal}</strong> soal</span>
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={handleResetKuis}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Ulangi Kuis
              </button>
              <button
                onClick={() => setActiveKuisId(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Pilih Kuis Lain
              </button>
            </div>
          </div>

          {/* Pembahasan Soal & Kunci Jawaban */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Pembahasan & Review Jawaban:
            </h3>

            {hasilKuis.evaluasi?.map((item, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl bg-white border ${
                  item.benar ? 'border-blue-200' : 'border-rose-200'
                } shadow-xs space-y-2.5`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Soal #{idx + 1}</span>
                  {item.benar ? (
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Benar (+20)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Belum Tepat
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  {item.pertanyaan}
                </p>

                {/* Info Kunci */}
                <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl">
                  <p className="text-slate-600">
                    Kunci Jawaban: <strong className="text-blue-700 font-bold">{item.pilihan[item.kunciJawaban]}</strong>
                  </p>
                  {item.pembahasan && (
                    <p className="text-slate-500 italic mt-1">
                      💡 {item.pembahasan}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      );
    }

    // B. MODE MENGERJAKAN SOAL KUIS
    const currentSoal = activeKuis.soal[currentIndex];
    const totalSoal = activeKuis.soal.length;
    const progressPercent = Math.round(((currentIndex + 1) / totalSoal) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-24 md:pb-8">
        
        {/* Header Kuis & Progress Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveKuisId(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Batal
            </button>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
              Soal {currentIndex + 1} dari {totalSoal}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card Pertanyaan Soal */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md space-y-5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentSoal.pertanyaan}
          </h2>

          {/* Opsi Pilihan Ganda */}
          <div className="space-y-2.5">
            {currentSoal.pilihan.map((opsi, idx) => {
              const isSelected = jawabanUser[currentSoal.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handlePilihJawaban(currentSoal.id, idx)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all border flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-950 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
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
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opsi}</span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigasi Bawah Soal */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrevQuestion}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Sebelumnya
            </button>

            {currentIndex < totalSoal - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                Selanjutnya <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitKuis}
                disabled={kuisSubmitting}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-700/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                {kuisSubmitting ? 'Menilai...' : 'Selesai & Kumpulkan'}
              </button>
            )}
          </div>
        </div>

      </div>
    );
  }

  // --- 2. TAMPILAN DAFTAR KUIS TERSEDIA PER KELAS ---
  return (
    <div className="space-y-6 pb-24 md:pb-8">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-700" />
            Kuis Interaktif PAI
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Uji wawasan dan latihan soal per bab materi PAI Kelas {activeKelas}.
          </p>
        </div>

        {/* Filter Kelas */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
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
        </div>
      </div>

      {/* Grid Kartu Paket Kuis */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
          Memuat paket kuis PAI...
        </div>
      ) : kuisList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kuisList.map((k) => (
            <div
              key={k.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    PAI Kelas {k.kelas}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {k.durasi_menit} Menit
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {k.judul}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kategori: {k.kategori}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  5 Butir Soal Pilihan Ganda
                </span>

                <button
                  onClick={() => handleStartKuis(k)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  Mulai Kuis <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          Belum ada paket kuis untuk kelas ini.
        </div>
      )}

    </div>
  );
}
