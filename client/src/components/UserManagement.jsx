import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Users, UserPlus, Key, Save, Loader2, ShieldCheck, GraduationCap } from 'lucide-react';
import { sounds } from './AudioCues';

import { API_BASE_URL } from '../config';

export default function UserManagement() {
  const { showToast } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for adding user
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    username: '', password: '', role: 'siswa', nama: '', nisn_nip: '', kelas: '7-A', gender: 'L'
  });
  const [adding, setAdding] = useState(false);

  // States for changing password
  const [editingUserId, setEditingUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [savingPass, setSavingPass] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      showToast('Gagal memuat daftar pengguna', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    sounds.playClick();
    setAdding(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      });
      const data = await res.json();
      if (data.success) {
        sounds.playSuccess();
        showToast('Pengguna baru berhasil ditambahkan');
        setShowAddForm(false);
        setAddForm({ username: '', password: '', role: 'siswa', nama: '', nisn_nip: '', kelas: '7-A', gender: 'L' });
        fetchUsers();
      } else {
        sounds.playError();
        showToast(data.message, 'error');
      }
    } catch (error) {
      sounds.playError();
      showToast('Terjadi kesalahan', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handlePasswordSave = async (id) => {
    if (!newPassword) return showToast('Password tidak boleh kosong', 'error');
    sounds.playClick();
    setSavingPass(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      const data = await res.json();
      if (data.success) {
        sounds.playSuccess();
        showToast('Password berhasil diubah');
        setEditingUserId(null);
        setNewPassword('');
      } else {
        sounds.playError();
        showToast(data.message, 'error');
      }
    } catch (error) {
      sounds.playError();
      showToast('Gagal mengubah password', 'error');
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Manajemen Pengguna
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Kelola akun akses murid dan atur kata sandi mereka.</p>
        </div>
        <button
          onClick={() => { sounds.playClick(); setShowAddForm(!showAddForm); }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          {showAddForm ? 'Batal' : 'Tambah Pengguna'}
        </button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4">
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Peran (Role)</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium"
                >
                  <option value="siswa">Siswa</option>
                  <option value="guru">Guru</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Lengkap</label>
                <input
                  type="text" required
                  value={addForm.nama}
                  onChange={(e) => setAddForm({ ...addForm, nama: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Username / ID Login</label>
                <input
                  type="text" required
                  value={addForm.username}
                  onChange={(e) => setAddForm({ ...addForm, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Password Awal</label>
                <input
                  type="text" required
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">NISN / NIP</label>
                <input
                  type="text"
                  value={addForm.nisn_nip}
                  onChange={(e) => setAddForm({ ...addForm, nisn_nip: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                />
              </div>
              {addForm.role === 'siswa' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Kelas</label>
                    <input
                      type="text"
                      placeholder="Contoh: 7-A"
                      value={addForm.kelas}
                      onChange={(e) => setAddForm({ ...addForm, kelas: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Jenis Kelamin</label>
                    <select
                      value={addForm.gender}
                      onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit" disabled={adding}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Pengguna
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs">
                <th className="py-3 px-4">Nama & Role</th>
                <th className="py-3 px-4">Username / Login</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4 text-right">Aksi Password</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">Memuat data pengguna...</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {user.role === 'guru' ? <ShieldCheck className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{user.nama}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{user.role} {user.nisn_nip ? `• ${user.nisn_nip}` : ''}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">
                      {user.username}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs font-semibold">
                      {user.kelas || '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingUserId === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="text"
                            placeholder="Password Baru"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-32 px-2 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-hidden"
                            autoFocus
                          />
                          <button
                            onClick={() => handlePasswordSave(user.id)}
                            disabled={savingPass}
                            className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { setEditingUserId(null); setNewPassword(''); }}
                            className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 cursor-pointer"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { sounds.playClick(); setEditingUserId(user.id); setNewPassword(''); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5 text-blue-600" /> Ubah Sandi
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
