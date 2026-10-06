'use client';

import { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface Alumni {
  id: string;
  name: string;
  jabatan: string;
  img: string;
}

export default function AlumniListBuilder({ name, defaultValue }: { name: string, defaultValue: string }) {
  const parseDefault = () => {
    if (!defaultValue) return [];
    return defaultValue.split('\n').filter(l => l.trim()).map((line, i) => {
      const parts = line.split('|');
      let parsedName = '';
      let parsedJabatan = '';
      let parsedImg = '';

      if (parts.length === 3) {
        parsedName = parts[0]?.trim() || '';
        parsedJabatan = parts[1]?.trim() || '';
        parsedImg = parts[2]?.trim() || '';
      } else if (parts.length === 2) {
        // Fallback for old data without jabatan
        parsedName = parts[0]?.trim() || '';
        parsedImg = parts[1]?.trim() || '';
      }

      return {
        id: Date.now().toString() + i,
        name: parsedName,
        jabatan: parsedJabatan,
        img: parsedImg
      };
    });
  };

  const [items, setItems] = useState<Alumni[]>(parseDefault());

  const serialize = (currentItems: Alumni[]) => {
    return currentItems.map(item => `${item.name.replace(/\|/g, '')}|${item.jabatan.replace(/\|/g, '')}|${item.img.replace(/\|/g, '')}`).join('\n');
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString() + Math.random(), name: '', jabatan: '', img: '' }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof Alumni, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleUpload = async (id: string, file: File) => {
    if (!file) return;
    const toastId = toast.loading('Mengunggah gambar...');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        updateItem(id, 'img', data.url);
        toast.success('Gambar berhasil diunggah', { id: toastId });
      } else {
        toast.error(data.error || 'Gagal mengunggah', { id: toastId });
      }
    } catch (error) {
      toast.error('Terjadi kesalahan', { id: toastId });
    }
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serialize(items)} />
      
      {items.length === 0 && (
        <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
          Belum ada jejak lulusan. Klik tombol di bawah untuk menambahkan.
        </div>
      )}

      {items.map((item, index) => (
        <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl relative group shadow-sm">
          <div className="flex-1 space-y-3">
             <div className="grid sm:grid-cols-2 gap-3">
               <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase">Nama Lulusan</label>
                 <input type="text" placeholder="Cth: Ahmad Fulan" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
               </div>
               <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase">Jabatan / Universitas</label>
                 <input type="text" placeholder="Cth: Mahasiswa Universitas Indonesia" value={item.jabatan} onChange={e => updateItem(item.id, 'jabatan', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
               </div>
             </div>
             
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Foto (URL)</label>
                <div className="flex gap-2 items-center">
                  <input type="text" placeholder="https://... atau /uploads/..." value={item.img} onChange={e => updateItem(item.id, 'img', e.target.value)} className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <label className="cursor-pointer bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-200 dark:hover:bg-blue-800/50 flex items-center gap-2 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files?.[0]) handleUpload(item.id, e.target.files[0]) }} />
                  </label>
                </div>
             </div>
          </div>
          
          {item.img && (
            <div className="w-24 h-24 shrink-0 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2 self-center sm:self-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.img} alt="Preview" className="max-w-full max-h-full object-contain rounded-md" />
            </div>
          )}
          
          <button type="button" onClick={() => removeItem(item.id)} className="absolute -top-3 -right-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-red-200 dark:hover:bg-red-800/50 shadow-sm" aria-label="Hapus">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <button type="button" onClick={addItem} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors w-full justify-center border border-dashed border-blue-200 dark:border-blue-800">
        <Plus className="w-5 h-5" /> Tambah Jejak Lulusan Baru
      </button>
    </div>
  );
}
