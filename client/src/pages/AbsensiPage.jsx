import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchAbsensiBulanan, submitBatchAbsensi } from '../services/api';
import { UserCheck, CheckCircle2, Calendar, Download, ShieldCheck, Info, ChevronLeft, ChevronRight, Check, AlertCircle, Save, Users, Sparkles } from 'lucide-react';
import { sounds } from '../components/AudioCues';

export default function AbsensiPage() {
  const { activeKelas, setActiveKelas, currentUser, activeRole, showToast } = useApp();

  // State Bulan Terpilih (Format: 'YYYY-MM')
  const [selectedBulan, setSelectedBulan] = useState('2026-09');
  const [dataBulanan, setDataBulanan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab view khusus guru: 'matriks' (Rekap Matriks Bulanan) vs 'input' (Input Presensi Harian Guru)
  const [guruTab, setGuruTab] = useState('matriks');

  // State Form Input Presensi oleh Guru (Pak Bani)
  const [inputTanggal, setInputTanggal] = useState('2026-09-23');
  const [draftAbsensi, setDraftAbsensi] = useState({}); // { [nama_siswa]: { status: 'Hadir'|'Sakit'|'Izin'|'Alpa', keterangan: '' } }
  const [savingBatch, setSavingBatch] = useState(false);

  // Nama-nama bulan Indonesia
  const daftarBulan = [
    { value: '2026-07', label: 'Juli 2026' },
    { value: '2026-08', label: 'Agustus 2026' },
    { value: '2026-09', label: 'September 2026' },
    { value: '2026-10', label: 'Oktober 2026' },
    { value: '2026-11', label: 'November 2026' },
    { value: '2026-12', label: 'Desember 2026' },
  ];

  const kelasLabel = `${activeKelas}-A`;

  // Load data bulanan
  const loadDataBulanan = () => {
    setLoading(true);
    fetchAbsensiBulanan(kelasLabel, selectedBulan)
      .then((res) => {
        if (res.success) {
          setDataBulanan(res.data);
          // Inisialisasi draft input untuk guru jika belum ada
          if (res.data.daftarSiswa) {
            const initialDraft = {};
            res.data.daftarSiswa.forEach(s => {
              // Jika di tanggal inputTanggal sudah ada di matrix, pakai itu
              const existingRecord = res.data.matrix?.[s.nama]?.[inputTanggal];
              initialDraft[s.nama] = {
                nisn: s.nisn,
                status: existingRecord ? existingRecord.status : 'Hadir',
                keterangan: existingRecord ? existingRecord.keterangan : 'Hadir tepat waktu'
              };
            });
            setDraftAbsensi(initialDraft);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDataBulanan();
  }, [activeKelas, selectedBulan]);

  // Update draft saat inputTanggal berubah
  useEffect(() => {
    if (dataBulanan?.daftarSiswa) {
      const updatedDraft = {};
      dataBulanan.daftarSiswa.forEach(s => {
        const existingRecord = dataBulanan.matrix?.[s.nama]?.[inputTanggal];
        updatedDraft[s.nama] = {
          nisn: s.nisn,
          status: existingRecord ? existingRecord.status : 'Hadir',
          keterangan: existingRecord ? existingRecord.keterangan : 'Hadir tepat waktu'
        };
      });
      setDraftAbsensi(updatedDraft);
    }
  }, [inputTanggal, dataBulanan]);

  // Aksi Guru: Tandai Semua Siswa Hadir
  const handleMarkAllHadir = () => {
    sounds.playClick();
    if (!dataBulanan?.daftarSiswa) return;
    const updated = { ...draftAbsensi };
    dataBulanan.daftarSiswa.forEach(s => {
      updated[s.nama] = {
        ...updated[s.nama],
        status: 'Hadir',
        keterangan: 'Hadir tepat waktu'
      };
    });
    setDraftAbsensi(updated);
    showToast('Seluruh siswa ditandai Hadir');
  };

  // Aksi Guru: Ubah status per siswa di draft
  const handleSetStudentStatus = (nama, status) => {
    sounds.playClick();
    setDraftAbsensi(prev => ({
      ...prev,
      [nama]: {
        ...prev[nama],
        status: status,
        keterangan: status === 'Hadir' ? 'Hadir tepat waktu' : prev[nama]?.keterangan || status
      }
    }));
  };

  const handleKeteranganChange = (nama, ket) => {
    setDraftAbsensi(prev => ({
      ...prev,
      [nama]: {
        ...prev[nama],
        keterangan: ket
      }
    }));
  };

  // Aksi Guru: Simpan Presensi Harian Batch
  const handleSaveBatchAbsensi = async (e) => {
    e.preventDefault();
    sounds.playClick();
    setSavingBatch(true);

    const listAbsensi = Object.keys(draftAbsensi).map(nama => ({
      nama_siswa: nama,
      nisn: draftAbsensi[nama].nisn,
      status: draftAbsensi[nama].status,
      keterangan: draftAbsensi[nama].keterangan
    }));

    try {
      const res = await submitBatchAbsensi({
        kelas: kelasLabel,
        tanggal: inputTanggal,
        listAbsensi
      });

      if (res.success) {
        sounds.playSuccess();
        showToast(res.message);
        loadDataBulanan();
        setGuruTab('matriks'); // Pindah ke tampilan matriks bulanan
      } else {
        sounds.playError();
        showToast(res.message, 'error');
      }
    } catch (err) {
      sounds.playError();
      showToast('Gagal menyimpan presensi', 'error');
    } finally {
      setSavingBatch(false);
    }
  };

  // Export Rekap Bulanan ke CSV (Format Matriks)
  const handleExportBulananCSV = () => {
    sounds.playClick();
    if (!dataBulanan || !dataBulanan.daftarSiswa || dataBulanan.daftarSiswa.length === 0) {
      showToast('Belum ada data absensi bulanan untuk diekspor', 'error');
      return;
    }

    const tglHeaders = dataBulanan.tanggalList.map(t => t.substring(8, 10)); // Hanya tanggal (misal 02, 07, 09)
    const headers = ['No', 'NISN', 'Nama Siswa', 'L/P', ...tglHeaders, 'Hadir (H)', 'Sakit (S)', 'Izin (I)', 'Alpa (A)', '% Kehadiran'];

    const rows = dataBulanan.daftarSiswa.map((s, idx) => {
      const rk = dataBulanan.rekapSiswa[s.nama] || { H: 0, S: 0, I: 0, A: 0, persen: 100 };
      const statusPerTgl = dataBulanan.tanggalList.map(t => {
        const item = dataBulanan.matrix?.[s.nama]?.[t];
        return item ? item.status.charAt(0) : '-';
      });

      return [
        idx + 1,
        s.nisn,
        `"${s.nama}"`,
        s.gender || 'L',
        ...statusPerTgl,
        rk.H,
        rk.S,
        rk.I,
        rk.A,
        `"${rk.persen}%"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Presensi_Bulanan_PAI_Kelas_${kelasLabel}_${selectedBulan}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Rekap presensi bulanan berhasil diunduh (CSV)! 📄');
  };

  const rekapKelas = dataBulanan?.rekapKelas || { Hadir: 0, Sakit: 0, Izin: 0, Alpa: 0, totalPertemuan: 0, persentase: 100 };
  const userPersonalRekap = dataBulanan?.rekapSiswa?.[currentUser.nama] || { H: 0, S: 0, I: 0, A: 0, persen: 100 };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-blue-700" />
              Presensi Siswa PAI Per Bulan
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Dikelola Pak Bani
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rekapitulasi kehadiran KBM Pendidikan Agama Islam Kelas {kelasLabel} per bulan kalender.
          </p>
        </div>

        {/* Pemilih Jenjang Kelas 7, 8, 9 */}
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
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kelas {kls}-A
            </button>
          ))}
        </div>)}
      </div>

      {/* Bar Kontrol Bulan & Tab Mode (Guru/Siswa) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
        
        {/* Selector Bulan */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-700" />
          <span className="text-xs font-bold text-slate-700">Pilih Bulan:</span>
          <select
            value={selectedBulan}
            onChange={(e) => {
              sounds.playClick();
              setSelectedBulan(e.target.value);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {daftarBulan.map(b => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>

        {/* Tab Switcher jika Mode Guru: 'Matriks Rekap Bulanan' vs 'Input Presensi' */}
        {activeRole === 'guru' ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => {
                  sounds.playClick();
                  setGuruTab('matriks');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  guruTab === 'matriks'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rekap Matriks Bulanan
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setGuruTab('input');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  guruTab === 'input'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                + Input Presensi Tanggal
              </button>
            </div>

            <button
              onClick={handleExportBulananCSV}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBulananCSV}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Rekap CSV</span>
            </button>
          </div>
        )}

      </div>

      {/* Ringkasan Statistik Bulanan Kelas */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Pertemuan</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{rekapKelas.totalPertemuan} <span className="text-xs font-normal text-slate-400">kali</span></p>
          <span className="text-[10px] text-slate-400">Bulan ini</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-blue-700 uppercase">Total Hadir</span>
          <p className="text-2xl font-extrabold text-blue-800 mt-1">{rekapKelas.Hadir}</p>
          <span className="text-[10px] text-slate-400">Presensi Hadir</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase">Sakit (S)</span>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{rekapKelas.Sakit}</p>
          <span className="text-[10px] text-slate-400">Izin dokter</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase">Izin (I)</span>
          <p className="text-2xl font-extrabold text-blue-700 mt-1">{rekapKelas.Izin}</p>
          <span className="text-[10px] text-slate-400">Izin tertulis</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-purple-600 uppercase">Persentase Kelas</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{rekapKelas.persentase}%</p>
          <span className="text-[10px] text-blue-600 font-semibold">Tingkat kehadiran</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TAMPILAN KHUSUS SISWA (READ-ONLY DENGAN INFORMASI RESMI DARI PAK BANI) */}
      {/* ========================================================================= */}
      {activeRole === 'siswa' && (
        <div className="space-y-4">
          
          {/* Banner Pemberitahuan Bahwa Presensi Hanya Diisi Pak Bani */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-100 border border-blue-200 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-blue-800 text-white mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-blue-950">
                Informasi Presensi Siswa: Dikelola Resmi oleh Bapak Guru (Pak Bani)
              </h3>
              <p className="text-xs text-blue-800 mt-0.5 leading-relaxed">
                Pencatatan dan verifikasi kehadiran KBM PAI diisi langsung oleh <strong>Pak Bani, S.Pd.I</strong> pada setiap sesi jam pelajaran. Siswa dapat memantau riwayat dan akumulasi persentase kehadiran bulanan pada tabel di bawah ini.
              </p>
            </div>
          </div>

          {/* Kartu Ringkasan Kehadiran Pribadi Siswa */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Profil Siswa Terdaftar</span>
                <h3 className="text-base font-extrabold text-slate-900">{currentUser.nama}</h3>
                <p className="text-xs text-slate-500">NISN: {currentUser.nisn || '0081234501'} • Kelas: {kelasLabel}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">Kehadiran Bulan Ini</span>
                  <span className="text-2xl font-black text-blue-700">{userPersonalRekap.persen}%</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Rekap Angka Siswa Pribadi */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-blue-50">
                <span className="text-[10px] font-bold text-blue-700 block">Hadir (H)</span>
                <strong className="text-base font-extrabold text-blue-900">{userPersonalRekap.H} hari</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50">
                <span className="text-[10px] font-bold text-amber-700 block">Sakit (S)</span>
                <strong className="text-base font-extrabold text-amber-900">{userPersonalRekap.S} hari</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50">
                <span className="text-[10px] font-bold text-blue-700 block">Izin (I)</span>
                <strong className="text-base font-extrabold text-blue-900">{userPersonalRekap.I} hari</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50">
                <span className="text-[10px] font-bold text-rose-700 block">Alpa (A)</span>
                <strong className="text-base font-extrabold text-rose-900">{userPersonalRekap.A} hari</strong>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB INPUT PRESIENSI HARIAN KHUSUS GURU (PAK BANI)                     */}
      {/* ========================================================================= */}
      {activeRole === 'guru' && guruTab === 'input' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-md space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                Input & Perbarui Presensi Kelas {kelasLabel}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengampu: <strong>Pak Bani, S.Pd.I</strong> • Pilih tanggal KBM dan tentukan status kehadiran siswa.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={inputTanggal}
                onChange={(e) => setInputTanggal(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleMarkAllHadir}
                className="px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-bold transition-all cursor-pointer"
              >
                ✓ Tandai Semua Hadir
              </button>
            </div>
          </div>

          {/* Form Daftar Siswa untuk Input Cepat */}
          <form onSubmit={handleSaveBatchAbsensi} className="space-y-4">
            <div className="divide-y divide-slate-100">
              {dataBulanan?.daftarSiswa?.map((siswa, idx) => {
                const currentDraft = draftAbsensi[siswa.nama] || { status: 'Hadir', keterangan: '' };
                return (
                  <div
                    key={siswa.id}
                    className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs font-bold text-slate-400">
                        {idx + 1}.
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{siswa.nama}</p>
                        <p className="text-[10px] text-slate-400">NISN: {siswa.nisn} • Gender: {siswa.gender}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* 4 Pilihan Status Cepat */}
                      {[
                        { id: 'Hadir', label: 'Hadir (H)', bg: 'bg-blue-700 text-white' },
                        { id: 'Sakit', label: 'Sakit (S)', bg: 'bg-amber-500 text-white' },
                        { id: 'Izin', label: 'Izin (I)', bg: 'bg-blue-600 text-white' },
                        { id: 'Alpa', label: 'Alpa (A)', bg: 'bg-rose-600 text-white' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSetStudentStatus(siswa.nama, opt.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                            currentDraft.status === opt.id
                              ? `${opt.bg} border-transparent shadow-xs scale-105`
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}

                      {/* Input Keterangan Khusus */}
                      <input
                        type="text"
                        placeholder="Keterangan..."
                        value={currentDraft.keterangan || ''}
                        onChange={(e) => handleKeteranganChange(siswa.nama, e.target.value)}
                        className="px-2.5 py-1 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-700 w-36 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setGuruTab('matriks')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={savingBatch}
                className="px-6 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-extrabold shadow-md shadow-blue-900/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {savingBatch ? 'Menyimpan...' : `Simpan Presensi Tanggal ${inputTanggal}`}
              </button>
            </div>
          </form>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAMPILAN MATRIKS REKAP BULANAN (UNTUK GURU & SISWA)                   */}
      {/* ========================================================================= */}
      {(activeRole === 'siswa' || guruTab === 'matriks') && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-700" />
                Tabel Matriks Kehadiran Bulanan (Kelas {kelasLabel})
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Bulan: <strong>{selectedBulan}</strong> • Total Siswa: {dataBulanan?.daftarSiswa?.length || 0} orang
              </p>
            </div>

            {/* Legend / Keterangan Kode */}
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">H = Hadir</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">S = Sakit</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">I = Izin</span>
              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">A = Alpa</span>
            </div>
          </div>

          {/* Tabel Matriks Bulanan Responsif */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-2.5 text-center w-8">No</th>
                  <th className="py-2.5 px-3 min-w-[150px]">Nama Siswa</th>
                  <th className="py-2.5 px-1.5 text-center w-8">L/P</th>

                  {/* Kolom Tanggal-tanggal di Bulan ini */}
                  {dataBulanan?.tanggalList?.map((tgl) => (
                    <th key={tgl} className="py-2 px-1 text-center w-8" title={tgl}>
                      <span className="block text-[11px] font-extrabold text-slate-800">
                        {tgl.substring(8, 10)}
                      </span>
                    </th>
                  ))}

                  {/* Kolom Rekapitulasi */}
                  <th className="py-2.5 px-1.5 text-center w-8 bg-blue-50 text-blue-900 font-black">H</th>
                  <th className="py-2.5 px-1.5 text-center w-8 bg-amber-50 text-amber-900 font-black">S</th>
                  <th className="py-2.5 px-1.5 text-center w-8 bg-blue-50 text-blue-900 font-black">I</th>
                  <th className="py-2.5 px-1.5 text-center w-8 bg-rose-50 text-rose-900 font-black">A</th>
                  <th className="py-2.5 px-2 text-center w-12 font-black">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={15} className="py-10 text-center text-slate-400">
                      Memuat data presensi bulanan...
                    </td>
                  </tr>
                ) : dataBulanan?.daftarSiswa?.length > 0 ? (
                  dataBulanan.daftarSiswa.map((siswa, idx) => {
                    const rekap = dataBulanan.rekapSiswa[siswa.nama] || { H: 0, S: 0, I: 0, A: 0, persen: 100 };
                    const isCurrentUser = siswa.nama === currentUser.nama;

                    return (
                      <tr
                        key={siswa.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isCurrentUser ? 'bg-blue-50/60 font-semibold' : ''
                        }`}
                      >
                        <td className="py-2 px-2 text-center text-slate-400 text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900">
                          {siswa.nama}
                          {isCurrentUser && (
                            <span className="ml-1 text-[9px] px-1 py-0.2 rounded-sm bg-blue-600 text-white font-normal">
                              Saya
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-1 text-center text-slate-500 text-[11px]">
                          {siswa.gender || 'L'}
                        </td>

                        {/* Sel per tanggal */}
                        {dataBulanan.tanggalList.map((tgl) => {
                          const record = dataBulanan.matrix?.[siswa.nama]?.[tgl];
                          const st = record ? record.status : null;

                          let badgeClass = 'text-slate-300';
                          let text = '-';
                          if (st === 'Hadir') {
                            badgeClass = 'bg-blue-100 text-blue-800 font-extrabold';
                            text = 'H';
                          } else if (st === 'Sakit') {
                            badgeClass = 'bg-amber-200 text-amber-900 font-extrabold';
                            text = 'S';
                          } else if (st === 'Izin') {
                            badgeClass = 'bg-blue-100 text-blue-800 font-extrabold';
                            text = 'I';
                          } else if (st === 'Alpa') {
                            badgeClass = 'bg-rose-200 text-rose-900 font-extrabold';
                            text = 'A';
                          }

                          return (
                            <td key={tgl} className="py-1 px-1 text-center" title={`${siswa.nama} (${tgl}): ${st || 'Belum ada data'}`}>
                              <span className={`inline-block w-6 h-6 leading-6 rounded-md text-[10px] text-center ${badgeClass}`}>
                                {text}
                              </span>
                            </td>
                          );
                        })}

                        {/* Rekap H, S, I, A */}
                        <td className="py-2 px-1.5 text-center font-bold text-blue-800 bg-blue-50/50">
                          {rekap.H}
                        </td>
                        <td className="py-2 px-1.5 text-center font-bold text-amber-700 bg-amber-50/50">
                          {rekap.S}
                        </td>
                        <td className="py-2 px-1.5 text-center font-bold text-blue-700 bg-blue-50/50">
                          {rekap.I}
                        </td>
                        <td className="py-2 px-1.5 text-center font-bold text-rose-700 bg-rose-50/50">
                          {rekap.A}
                        </td>
                        <td className="py-2 px-2 text-center font-black text-slate-800">
                          {rekap.persen}%
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={15} className="py-8 text-center text-slate-400">
                      Belum ada data presensi siswa pada bulan ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
