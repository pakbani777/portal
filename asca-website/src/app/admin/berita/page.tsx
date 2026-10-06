import { FileText, Plus, Trash2 } from 'lucide-react';
import prisma from '@/lib/prisma';
import { addPost, deletePost } from './actions';

export const metadata = {
  title: 'Kelola Berita & Artikel | ASCA Admin',
};

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ inst?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentInst = resolvedParams.inst || 'UMUM';

  const posts = await prisma.post.findMany({
    where: { institution: currentInst },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" /> Berita & Artikel
          </h1>
          <p className="text-slate-500 mt-2">
            Kelola pengumuman, berita kegiatan, dan artikel untuk pengunjung.
          </p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        <a href="?inst=UMUM" className={`whitespace-nowrap px-6 py-2 rounded-full font-bold transition-colors ${currentInst === 'UMUM' ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          Umum / Yayasan
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tulis Berita {currentInst}</h2>
            
            <form action={addPost} className="space-y-4">
              <input type="hidden" name="institution" value={currentInst} />
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Judul Berita</label>
                <input required name="title" type="text" placeholder="Kegiatan Mabit Santri..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kategori</label>
                <input required name="category" type="text" placeholder="Kegiatan / Prestasi" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">URL Gambar (Opsional)</label>
                <input name="imageUrl" type="url" placeholder="https://contoh.com/foto.jpg" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Isi Konten</label>
                <textarea required name="content" rows={6} placeholder="Tulis isi berita di sini..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold transition-colors">
                <Plus className="h-5 w-5" /> Publikasikan
              </button>
            </form>
          </div>
        </div>

        {/* Daftar Berita */}
        <div className="lg:col-span-2">
          {posts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Belum ada berita</h3>
              <p className="text-slate-500">Berita untuk kategori {currentInst} masih kosong.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((p) => (
                <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col sm:flex-row gap-5">
                  {p.imageUrl && (
                    <div className="sm:w-48 h-32 rounded-xl bg-slate-200 dark:bg-slate-800 flex-shrink-0 overflow-hidden relative hidden sm:block">
                      <img src={p.imageUrl} alt={p.title} className="object-cover w-full h-full" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
                          {p.category}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-2">{p.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-2">{p.content}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" /> Hapus
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
