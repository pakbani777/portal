'use client';

import { useState, useActionState, useEffect } from 'react';
import { addUser, updatePassword, deleteUser } from '@/app/admin/pengguna/actions';
import { toast } from 'sonner';
import { UserPlus, KeyRound, Trash2, X, Plus } from 'lucide-react';

export default function UserManagement({ users, currentUser }: { users: any[], currentUser: any }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [changePwdId, setChangePwdId] = useState<string | null>(null);

  // Add User Action
  const [addState, addAction, addPending] = useActionState(addUser, { error: undefined, success: undefined } as any);
  
  useEffect(() => {
    if (addState?.success) {
      toast.success('Admin berhasil ditambahkan');
      setIsAddOpen(false);
    } else if (addState?.error) {
      toast.error(addState.error);
    }
  }, [addState]);

  // Update Password Action
  const [pwdState, pwdAction, pwdPending] = useActionState(updatePassword, { error: undefined, success: undefined } as any);

  useEffect(() => {
    if (pwdState?.success) {
      toast.success('Password berhasil diperbarui');
      setChangePwdId(null);
    } else if (pwdState?.error) {
      toast.error(pwdState.error);
    }
  }, [pwdState]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus admin ${name}?`)) {
      const res = await deleteUser(id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(`Admin ${name} berhasil dihapus`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan Pengurus (Admin)</h1>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Tambah Admin
        </button>
      </div>

      {isAddOpen && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tambah Admin Baru</h2>
            <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form action={addAction} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
              <input type="text" name="name" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Username</label>
              <input type="text" name="username" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input type="password" name="password" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
            <button disabled={addPending} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2">
              {addPending ? 'Menyimpan...' : <><Plus className="h-4 w-4" /> Simpan Admin</>}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative group overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-2">
                  <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">{user.username}</span>
                  {currentUser.id === user.id && (
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Anda
                    </span>
                  )}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-lg">
                {user.name.charAt(0)}
              </div>
            </div>

            {changePwdId === user.id ? (
              <form action={pwdAction} className="mt-6 space-y-3 animate-in fade-in">
                <input type="hidden" name="id" value={user.id} />
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password Baru</label>
                  <input type="password" name="newPassword" required minLength={6} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" placeholder="Minimal 6 karakter" />
                </div>
                <div className="flex gap-2">
                  <button disabled={pwdPending} type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs transition-colors">
                    {pwdPending ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button type="button" onClick={() => setChangePwdId(null)} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors">
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setChangePwdId(user.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  <KeyRound className="h-3.5 w-3.5" /> Ganti Password
                </button>
                {currentUser.id !== user.id && (
                  <button 
                    onClick={() => handleDelete(user.id, user.name)}
                    className="flex-none flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
