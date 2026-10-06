import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Upload, Save, User, Key, CheckCircle2 } from 'lucide-react';
import { sounds } from './AudioCues';

import { API_BASE_URL } from '../config';

export default function ProfileModal({ isOpen, onClose }) {
  const { currentUser, login, showToast } = useApp();
  
  const [formData, setFormData] = useState({
    nama: currentUser?.nama || '',
    username: currentUser?.username || '',
    password: ''
  });
  
  const [fotoFile, setFotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentUser?.foto_profil || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      sounds.playClick();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sounds.playClick();
    setLoading(true);

    const data = new FormData();
    data.append('id', currentUser.id);
    data.append('nama', formData.nama);
    data.append('username', formData.username);
    if (formData.password) data.append('password', formData.password);
    if (fotoFile) data.append('foto', fotoFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'POST',
        body: data,
      });

      const resData = await response.json();
      if (resData.success) {
        sounds.playSuccess();
        showToast('Profil berhasil diperbarui!');
        // Update current user in context/localStorage
        // Since login updates state and localStorage, we can use it here
        login(resData.data);
        onClose();
      } else {
        sounds.playError();
        showToast(resData.message, 'error');
      }
    } catch (err) {
      sounds.playError();
      showToast('Gagal memperbarui profil', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Prepare full URL for existing photo
  const displayUrl = previewUrl 
    ? (previewUrl.startsWith('blob:') ? previewUrl : `${API_BASE_URL}${previewUrl}`)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Edit Profil {currentUser?.role === 'guru' ? 'Guru' : 'Siswa'}
          </h2>
          <button onClick={() => { sounds.playClick(); onClose(); }} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          <form id="profileForm" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Foto Profil Upload */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-blue-50 flex items-center justify-center">
                  {displayUrl ? (
                    <img src={displayUrl} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-blue-300" />
                  )}
                </div>
                <div className="absolute inset-0 bg-slate-900/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Ketuk untuk ganti foto
              </p>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Username / NISN */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Username / ID Login</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password Baru */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center justify-between">
                <span>Kata Sandi Baru</span>
                <span className="text-[10px] text-slate-400 font-normal">(Kosongkan jika tidak diubah)</span>
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => { sounds.playClick(); onClose(); }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            form="profileForm"
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
          >
            {loading ? (
              'Menyimpan...'
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Profil
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
