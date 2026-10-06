import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import prisma from '@/lib/prisma';
import { addTestimonial, deleteTestimonial } from './actions';

export const metadata = {
  title: 'Kelola Testimoni | ASCA Admin',
};

export default async function TestimoniPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-blue-500" /> Kelola Komentar / Testimoni
          </h1>
          <p className="text-slate-500 mt-2">
            Komentar orang tua yang akan ditampilkan di halaman depan lembaga.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Form Tambah */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tambah Komentar Baru</h2>
            
            <form action={addTestimonial} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Orang Tua</label>
                <input required name="parentName" type="text" placeholder="Bpk. Fulan" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Anak (Santri)</label>
                <input required name="studentName" type="text" placeholder="Ahmad (Kelas 3)" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Lembaga</label>
                <select required name="institution" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white">
                  <option value="RQA">Rumah Qur'an (RQA)</option>
                  <option value="SDQu">SD Qur'an (SDQu)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Isi Komentar</label>
                <textarea required name="content" rows={4} placeholder="Alhamdulillah sejak masuk RQA..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold transition-colors">
                <Plus className="h-5 w-5" /> Tambahkan
              </button>
            </form>
          </div>
        </div>

        {/* Daftar Komentar */}
        <div className="lg:col-span-2 space-y-4">
          {testimonials.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Belum ada komentar</h3>
              <p className="text-slate-500">Komentar yang Anda tambahkan akan muncul di sini.</p>
            </div>
          ) : (
            testimonials.map((t) => (
              <div key={t.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {t.parentName[0]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{t.parentName}</h4>
                      <p className="text-sm text-slate-500">Orang tua dari {t.studentName} <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${t.institution === 'RQA' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{t.institution}</span></p>
                    </div>
                    <form action={deleteTestimonial}>
                      <input type="hidden" name="id" value={t.id} />
                      <button type="submit" className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                  <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed">"{t.content}"</p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
