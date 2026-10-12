import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { createKelas, deleteKelas } from '../services/api';
import { X, Plus, Trash2, School, Check, Sparkles } from 'lucide-react';
import { sounds } from './AudioCues';

export default function ModalKelolaKelas({ isOpen, onClose }) {
  const { daftarKelas = [], setDaftarKelas, loadDaftarKelas, activeKelas, setActiveKelas, showToast } = useApp();
  const [namaInput, setNamaInput] = useState('');
  const [selectedJenjang, setSelectedJenjang] = useState('7');
  const [submitting, setSubmitting] = useState(false);
  const [deletingName, setDeletingName] = useState(null);

  if (!isOpen) return null;

  // Normalisasi preview nama kelas
  const getNormalizedName = (val) => {
    let clean = (val || '').trim().toUpperCase().replace(/\s*-\s*/g, '-').replace(/\s+/g, ' ');
    if (/^[0-9]+[A-Z]$/.test(clean)) {
      clean = `${clean.slice(0, -1)}-${clean.slice(-1)}`;
    }
    return clean;
  };

  const previewName = getNormalizedName(namaInput);
  const isAlreadyExist = daftarKelas.includes(previewName);

  const handleTambahKelas = async (e) => {
    if (e) e.preventDefault();
    sounds.playClick();

    const target = previewName;
    if (!target) {
      showToast('Ketik nama kelas yang ingin ditambahkan (misal: 7-C atau 8-D)', 'error');
      return;
    }

    if (isAlreadyExist) {
      showToast(`Kelas ${target} sudah ada dalam daftar kelas aktif!`, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createKelas(target);
      if (res.success) {
        sounds.playSuccess();
        showToast(res.message || `Kelas ${target} berhasil ditambahkan!`);
        setNamaInput('');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setDaftarKelas(res.data);
        } else {
          await loadDaftarKelas();
        }
        setActiveKelas(target);
      } else {
        sounds.playError();
        showToast(res.message || 'Gagal menambahkan kelas', 'error');
      }
    } catch (err) {
      sounds.playError();
      showToast('Gagal terhubung ke server', 'error');
    }
    setSubmitting(false);
  };

  const handleQuickAdd = async (jenjang, rombel) => {
    const target = `${jenjang}-${rombel}`;
    if (daftarKelas.includes(target)) {
      sounds.playClick();
      setActiveKelas(target);
      showToast(`Kelas ${target} sudah aktif.`);
      return;
    }

    sounds.playClick();
    setSubmitting(true);
    try {
      const res = await createKelas(target);
      if (res.success) {
        sounds.playSuccess();
        showToast(res.message || `Kelas ${target} berhasil ditambahkan!`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setDaftarKelas(res.data);
        } else {
          await loadDaftarKelas();
        }
        setActiveKelas(target);
      } else {
        sounds.playError();
        showToast(res.message || 'Gagal menambahkan kelas', 'error');
      }
    } catch (err) {
      sounds.playError();
      showToast('Gagal terhubung ke server', 'error');
    }
    setSubmitting(false);
  };

  const handleHapusKelas = async (nama) => {
    if (!window.confirm(`Yakin ingin menghapus Kelas ${nama}? Kelas hanya dapat dihapus jika tidak ada siswa yang terdaftar.`)) return;
    sounds.playClick();
    setDeletingName(nama);
    try {
      const res = await deleteKelas(nama);
      if (res.success) {
        sounds.playSuccess();
        showToast(res.message || `Kelas ${nama} berhasil dihapus!`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setDaftarKelas(res.data);
        } else {
          await loadDaftarKelas();
        }
        if (activeKelas === nama) {
          const sisa = (res.data || daftarKelas || []).filter(k => k !== nama);
          if (sisa.length > 0) setActiveKelas(sisa[0]);
        }
      } else {
        sounds.playError();
        showToast(res.message || 'Gagal menghapus kelas', 'error');
      }
    } catch (err) {
      sounds.playError();
      showToast('Gagal menghapus kelas', 'error');
    }
    setDeletingName(null);
  };

  const rombelOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Kelola Rombel & Tambah Kelas</h3>
              <p className="text-[11px] text-slate-500">Atur pembagian kelas otomatis untuk penilaian dan presensi</p>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Form Ketik Manual Bebas */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <label className="block text-xs font-bold text-slate-700">
            Penambahan Kelas Manual:
          </label>
          <form onSubmit={handleTambahKelas} className="space-y-2.5">
            <div className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={namaInput}
                onChange={(e) => setNamaInput(e.target.value)}
                placeholder="Ketik nama kelas (Contoh: 7-C, 8-D, 9-C, VII-A)"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 uppercase"
              />
              <button
                type="submit"
                disabled={submitting || !previewName || isAlreadyExist}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{submitting ? 'Menyimpan...' : 'Tambah Kelas'}</span>
              </button>
            </div>

            {previewName && (
              <div className="flex items-center justify-between text-[11px] px-1">
                <span className="text-slate-500">
                  Format tersimpan: <strong className="text-blue-700 font-bold">{previewName}</strong>
                </span>
                {isAlreadyExist ? (
                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                    ⚠️ Kelas {previewName} sudah terdaftar
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    ✓ Siap ditambahkan
                  </span>
                )}
              </div>
            )}
          </form>

          {/* 2. Pilihan Cepat Rombel (1-Click Shortcut) */}
          <div className="pt-2 border-t border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Pilihan Cepat Rombel:
              </span>
              <div className="flex gap-1 bg-slate-200/70 p-0.5 rounded-lg text-[10px] font-bold">
                {['7', '8', '9'].map(j => (
                  <button
                    key={j}
                    type="button"
                    onClick={() => { sounds.playClick(); setSelectedJenjang(j); }}
                    className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                      selectedJenjang === j ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Kelas {j}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {rombelOptions.map((r) => {
                const targetKls = `${selectedJenjang}-${r}`;
                const isExists = daftarKelas.includes(targetKls);
                return (
                  <button
                    key={r}
                    type="button"
                    disabled={submitting}
                    onClick={() => handleQuickAdd(selectedJenjang, r)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      isExists
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 shadow-2xs'
                    }`}
                    title={isExists ? `Kelas ${targetKls} sudah aktif` : `Tambah Kelas ${targetKls}`}
                  >
                    <span>{targetKls}</span>
                    {isExists ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Plus className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400">
              *Klik tombol rombel di atas untuk langsung mengaktifkan kelas yang diinginkan.
            </p>
          </div>
        </div>

        {/* 3. Daftar Kelas yang Sedang Aktif */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700">
              Daftar Kelas Aktif ({daftarKelas.length} Kelas):
            </label>
            <span className="text-[10px] text-slate-400 font-medium">Klik nama untuk memilih kelas aktif</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
            {daftarKelas.map((k) => {
              const isActive = activeKelas === k;
              return (
                <div
                  key={k}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                    isActive
                      ? 'bg-blue-50 border-blue-300 font-bold text-blue-900 shadow-2xs'
                      : 'bg-white border-slate-200 font-semibold text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span
                    onClick={() => { sounds.playClick(); setActiveKelas(k); showToast(`Beralih ke Kelas ${k}`); }}
                    className="cursor-pointer hover:underline flex-1 truncate"
                    title={`Pilih Kelas ${k}`}
                  >
                    Kelas {k}
                  </span>
                  <button
                    type="button"
                    disabled={deletingName === k}
                    onClick={() => handleHapusKelas(k)}
                    className="text-slate-300 hover:text-rose-600 p-1 rounded-md transition cursor-pointer"
                    title={`Hapus Kelas ${k}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">
            Perubahan otomatis tersimpan ke server.
          </p>
          <button
            type="button"
            onClick={() => { sounds.playClick(); onClose(); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
