import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { createKelas, deleteKelas } from '../services/api';
import { X, Plus, Trash2, School, Check, AlertCircle } from 'lucide-react';
import { sounds } from './AudioCues';

export default function ModalKelolaKelas({ isOpen, onClose }) {
  const { daftarKelas, loadDaftarKelas, activeKelas, setActiveKelas, showToast } = useApp();
  const [jenjang, setJenjang] = useState('7');
  const [kodeKelas, setKodeKelas] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingName, setDeletingName] = useState(null);

  if (!isOpen) return null;

  const namaBaru = `${jenjang}-${kodeKelas.toUpperCase().trim()}`;

  const handleTambahKelas = async (e) => {
    e.preventDefault();
    sounds.playClick();
    if (!kodeKelas.trim()) {
      showToast('Masukkan kode rombel kelas (misal: C atau D)', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createKelas(namaBaru);
      if (res.success) {
        sounds.playSuccess();
        showToast(res.message || `Kelas ${namaBaru} berhasil ditambahkan!`);
        setKodeKelas('');
        await loadDaftarKelas();
        setActiveKelas(namaBaru);
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
        await loadDaftarKelas();
        if (activeKelas === nama) {
          const sisa = (daftarKelas || []).filter(k => k !== nama);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Kelola Rombel / Tambah Kelas</h3>
              <p className="text-[11px] text-slate-400">Atur pembagian kelas untuk jenjang 7, 8, dan 9</p>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Tambah Kelas Baru */}
        <form onSubmit={handleTambahKelas} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <label className="block text-xs font-bold text-slate-700">
            Tambah Kelas Baru:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] text-slate-500 font-semibold mb-1">Jenjang</label>
              <select
                value={jenjang}
                onChange={(e) => setJenjang(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold cursor-pointer"
              >
                <option value="7">Kelas 7</option>
                <option value="8">Kelas 8</option>
                <option value="9">Kelas 9</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] text-slate-500 font-semibold mb-1">Rombel / Huruf</label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400">{jenjang}-</span>
                <input
                  type="text"
                  maxLength={4}
                  value={kodeKelas}
                  onChange={(e) => setKodeKelas(e.target.value.toUpperCase())}
                  placeholder="Contoh: C atau D"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold uppercase"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting || !kodeKelas.trim()}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{submitting ? 'Menyimpan...' : `Buat Kelas ${kodeKelas.trim() ? namaBaru : ''}`}</span>
            </button>
          </div>
        </form>

        {/* Daftar Kelas yang Ada */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Daftar Kelas yang Aktif ({(daftarKelas || []).length} Kelas):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
            {(daftarKelas || []).map((k) => {
              const isActive = activeKelas === k;
              return (
                <div
                  key={k}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                    isActive
                      ? 'bg-blue-50 border-blue-300 font-bold text-blue-900'
                      : 'bg-white border-slate-200 font-semibold text-slate-700'
                  }`}
                >
                  <span
                    onClick={() => { sounds.playClick(); setActiveKelas(k); }}
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
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => { sounds.playClick(); onClose(); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
}
