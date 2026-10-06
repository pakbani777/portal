import { Users, Plus, Trash2 } from 'lucide-react';
import prisma from '@/lib/prisma';
import { addTeacher, deleteTeacher } from './actions';
import Image from 'next/image';

export const metadata = {
  title: 'Kelola Tenaga Pengajar | ASCA Admin',
};

export default async function PengajarPage({
  searchParams,
}: {
  searchParams: Promise<{ inst?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentInst = resolvedParams.inst || 'UMUM';

  const teachers = await prisma.teacher.findMany({
    where: { institution: currentInst },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-500" /> Kelola Tenaga Pengajar & Tim
          </h1>
          <p className="text-slate-500 mt-2">
            Atur data dewan pengurus, guru, ustadz/ustadzah, dan staf yayasan.
          </p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        <a href="?inst=UMUM" className={`whitespace-nowrap px-6 py-2 rounded-full font-bold transition-colors ${currentInst === 'UMUM' ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          Dewan Pengurus (Utama)
        </a>
        <a href="?inst=RQA" className={`whitespace-nowrap px-6 py-2 rounded-full font-bold transition-colors ${currentInst === 'RQA' ? 'bg-orange-100 text-orange-700' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          Rumah Qur'an (RQA)
        </a>
        <a href="?inst=SDQu" className={`whitespace-nowrap px-6 py-2 rounded-full font-bold transition-colors ${currentInst === 'SDQu' ? 'bg-blue-100 text-blue-700' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          SD Qur'an (SDQu)
        </a>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Tambah */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tambah Anggota {currentInst === 'UMUM' ? 'Pengurus' : currentInst}</h2>
            
            <form action={addTeacher} className="space-y-4">
              <input type="hidden" name="institution" value={currentInst} />
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Lengkap & Gelar</label>
                <input required name="name" type="text" placeholder="Ust. Ahmad, S.Pd" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Posisi / Peran</label>
                <input required name="role" type="text" placeholder="Guru Kelas 1 / Pengajar Tahfidz" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tautan Pas Foto (URL)</label>
                <input name="imageUrl" type="url" placeholder="https://contoh.com/foto.jpg" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold transition-colors">
                <Plus className="h-5 w-5" /> Tambahkan
              </button>
            </form>
          </div>
        </div>

        {/* Daftar Pengajar */}
        <div className="lg:col-span-2">
          {teachers.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Belum ada pengajar</h3>
              <p className="text-slate-500">Data tenaga pengajar untuk {currentInst} masih kosong.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {teachers.map((t) => (
                <div key={t.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex gap-4 items-center">
                  <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0 overflow-hidden relative">
                    {t.imageUrl ? (
                      <img src={t.imageUrl} alt={t.name} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">{t.name[0]}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate">{t.name}</h4>
                    <p className="text-sm text-slate-500 truncate">{t.role}</p>
                  </div>
                  <form action={deleteTeacher}>
                    <input type="hidden" name="id" value={t.id} />
                    <button type="submit" className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
