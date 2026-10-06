'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { submitRegistrationSDQu } from '../actions';
import { toast } from 'sonner';

export default function SDQuForm({ children, programValue }: { children: React.ReactNode, programValue: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set('program', programValue); // Add the hidden program value explicitly
    
    try {
      const res = await submitRegistrationSDQu(null, formData);
      if (res.success) {
        toast.success('Pendaftaran Berhasil', {
          description: 'Data pendaftaran siswa berhasil dikirim. Kami akan segera menghubungi Anda.',
        });
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error('Pendaftaran Gagal', {
          description: res.error || 'Terjadi kesalahan saat mengirim data.',
        });
      }
    } catch (error) {
      toast.error('Error', { description: 'Gagal terhubung ke server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {children}
      <div className="pt-6 border-t border-blue-200 dark:border-white/10 mt-8">
        <button disabled={loading} type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <>Memproses <Loader2 className="h-5 w-5 animate-spin" /></>
          ) : (
            <>Simpan & Lanjutkan Pendaftaran <Send className="h-5 w-5" /></>
          )}
        </button>
        <p className="text-center text-sm font-medium text-blue-800/60 dark:text-slate-500 mt-4">
          Pihak sekolah akan menghubungi Anda via WhatsApp setelah data terverifikasi.
        </p>
      </div>
    </form>
  );
}
