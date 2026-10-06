import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronRight, Clock, Star, Users, ArrowRight, Calendar, Newspaper, Image as ImageIcon } from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Rumah Qur'an Assurur | Yayasan ASCA",
  description: "Program Tahsin dan Tahfidz komprehensif dari Yayasan Ahmad Surur Cendekia.",
};

export default async function RumahQuranPage() {
  const teachers = await prisma.teacher.findMany({
    where: { institution: "RQA" },
    orderBy: { createdAt: 'asc' }
  });

  const recentPosts = await prisma.post.findMany({
    where: { institution: "RQA" },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const settingsDb = await prisma.siteSetting.findMany({
    where: { group: 'RQA' }
  });

  const getSetting = (key: string, defaultValue: string) => {
    return settingsDb.find(s => s.key === key)?.value || defaultValue;
  };

  const heroTitle = getSetting('RQA_HERO_TITLE', 'Pusat Bimbingan Tahsin & Tahfidz Bersanad');
  const heroDesc = getSetting('RQA_HERO_DESC', 'Kami membimbing setiap langkah santri dari Iqro hingga menjadi Hafidz/Hafidzah yang mutqin.');
  
  const visi = getSetting('RQA_VISI', "Menjadi lembaga tahfidz percontohan yang melahirkan generasi Qur'ani yang mutqin dan berakhlakul karimah.");
  const misiRaw = getSetting('RQA_MISI', "Menerapkan metode tahsin bersanad;Membina hafalan dengan sistem mutaba'ah yaumiyyah;Menanamkan adab dan akhlak Islam");
  const misiArray = misiRaw.split(';').filter(m => m.trim() !== '');

  const galleryRaw = getSetting('RQA_GALLERY', "https://images.unsplash.com/photo-1609599006353-e629aaab3125\nhttps://images.unsplash.com/photo-1584553421349-355ceacddbe6");
  const galleryArray = galleryRaw.split('\n').map(s => s.trim()).filter(Boolean);

  return (
    <div className="pt-24 pb-12 bg-white dark:bg-[#0a0f1c] min-h-screen transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-orange-50/50 dark:bg-[#050810] border-b border-orange-100 dark:border-white/5">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-orange-200/50 dark:bg-orange-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-600 dark:text-orange-400 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Lembaga</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-blue-600 dark:text-blue-400">Rumah Qur'an</span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/30">
                <BookOpen className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-extrabold text-blue-950 dark:text-white sm:text-5xl lg:text-6xl mb-6 leading-tight">
                Rumah Qur'an <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">Assurur</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-800/80 dark:text-slate-300 font-medium leading-relaxed mb-8">
                {heroTitle}. {heroDesc}
              </p>
              <Link href="/pendaftaran/rumah-quran" className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 font-bold text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)] transition-all hover:bg-blue-600 hover:shadow-[0_4px_20px_rgba(37,99,235,0.4)]">
                Daftar Sekarang
              </Link>
            </div>
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-orange-100 dark:border-white/10 group h-[400px]">
              <img src="https://images.unsplash.com/photo-1584553421349-355cbcaaf333?q=80&w=1000&auto=format&fit=crop" alt="Kegiatan Tahfidz" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-950/80 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* VISI MISI SECTION */}
      <section className="py-24 bg-white dark:bg-[#0a0f1c]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            <div className="relative rounded-3xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-10 shadow-lg shadow-blue-900/5 dark:shadow-none">
              <Star className="mb-6 h-12 w-12 text-blue-600 dark:text-blue-400" />
              <h2 className="mb-4 text-3xl font-bold text-blue-950 dark:text-white">Visi RQA</h2>
              <p className="text-xl italic text-blue-800/80 dark:text-blue-100 leading-relaxed">
                "{visi}"
              </p>
            </div>

            <div className="relative rounded-3xl border border-orange-100 dark:border-orange-500/20 bg-orange-50/50 dark:bg-orange-950/20 p-10 shadow-lg shadow-orange-500/5 dark:shadow-none">
              <CheckCircle2 className="mb-6 h-12 w-12 text-orange-600 dark:text-orange-400" />
              <h2 className="mb-6 text-3xl font-bold text-blue-950 dark:text-white">Misi RQA</h2>
              <ul className="space-y-4">
                {misiArray.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-blue-900/80 dark:text-orange-50 font-medium">
                    <CheckCircle2 className="h-6 w-6 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-500 uppercase mb-3">Program Kami</h2>
            <h3 className="text-3xl font-bold text-blue-950 dark:text-white sm:text-4xl">Pilihan Kelas Pembelajaran</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Kelas Reguler Iqro & Tahsin", icon: Star, desc: "Perbaikan makhorijul huruf dan tajwid dari dasar hingga mahir membaca Al-Qur'an." },
              { title: "Kelas Tahfidz Anak & Remaja", icon: Users, desc: "Program menghafal Al-Qur'an dengan target capaian harian, muraja'ah, dan ujian mutqin." },
              { title: "Kelas Eksekutif / Dewasa", icon: Clock, desc: "Pembelajaran Al-Qur'an khusus dewasa dengan waktu yang fleksibel (sore & akhir pekan)." }
            ].map((prog, i) => (
              <div key={i} className="rounded-3xl bg-white dark:bg-white/5 border border-orange-100/50 dark:border-white/10 p-8 shadow-lg shadow-orange-900/5 hover:-translate-y-2 transition-all group">
                <div className="h-14 w-14 rounded-xl bg-orange-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white text-orange-600 dark:text-orange-400 transition-colors">
                  <prog.icon className="h-7 w-7" />
                </div>
                <h4 className="text-xl font-bold text-blue-950 dark:text-white mb-4">{prog.title}</h4>
                <p className="text-blue-800/70 dark:text-slate-400 font-medium leading-relaxed">{prog.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEUNGGULAN SECTION */}
      <section className="py-24 bg-orange-50/30 dark:bg-[#050810] border-y border-orange-100 dark:border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative rounded-3xl overflow-hidden shadow-2xl border border-orange-100 dark:border-white/10 h-[500px]">
              <img src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=1000&auto=format&fit=crop" alt="Mengaji" className="w-full h-full object-cover" />
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-sm font-bold tracking-widest text-orange-600 dark:text-orange-500 uppercase mb-3">Kenapa Memilih Kami?</h2>
              <h3 className="text-3xl font-bold text-blue-950 dark:text-white sm:text-4xl mb-8">Keunggulan Sistem Pembelajaran RQA</h3>
              
              <ul className="space-y-6">
                {[
                  "Pengajar berkompeten dan bersanad.",
                  "Metode pembelajaran yang mudah dan interaktif.",
                  "Rasio guru dan murid yang ideal (1:10) sehingga lebih fokus.",
                  "Laporan perkembangan santri harian melalui sistem digital.",
                  "Fasilitas ruang belajar ber-AC dan nyaman."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-orange-500 shrink-0 mt-1" />
                    <span className="text-lg font-medium text-blue-900/80 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GALERI SECTION */}
      {galleryArray.length > 0 && (
        <section className="py-24 bg-white dark:bg-[#0a0f1c]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
                <ImageIcon className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-blue-950 dark:text-white sm:text-4xl mb-6">Galeri Kegiatan</h2>
              <p className="text-lg text-blue-800/70 dark:text-slate-400 font-medium">
                Momen-momen berharga dalam proses belajar mengajar dan kegiatan santri di Rumah Qur'an Assurur.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryArray.map((url, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden shadow-lg border border-orange-100 dark:border-white/10 group aspect-[4/3]">
                  <img src={url} alt={`Galeri ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TENAGA PENGAJAR SECTION */}
      <section className="py-24 bg-white dark:bg-[#0a0f1c]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-orange-600 dark:text-orange-500 uppercase mb-3">Asatidzah</h2>
            <h3 className="text-3xl font-bold text-blue-950 dark:text-white sm:text-4xl">Tenaga Pengajar RQA</h3>
            <p className="mt-4 text-lg font-medium text-blue-800/70 dark:text-slate-400 max-w-2xl mx-auto">
              Dibimbing langsung oleh para asatidzah yang mutqin dan bersanad untuk menjaga kualitas bacaan dan hafalan santri.
            </p>
          </div>

          <div className="flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pb-8 sm:pb-0 scrollbar-hide">
            {teachers.map((person, i) => {
              const bgColors = ["from-orange-500 to-orange-400", "from-orange-400 to-orange-500", "from-yellow-500 to-orange-500", "from-orange-600 to-red-500"];
              const color = bgColors[i % bgColors.length];
              return (
              <div key={person.id} className="w-full sm:w-auto shrink-0 snap-center sm:snap-align-none group relative overflow-hidden rounded-3xl bg-orange-50/30 dark:bg-white/5 border border-orange-100 dark:border-white/10 p-8 text-center shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:bg-white/10">
                <div className={`mx-auto mb-6 h-32 w-32 rounded-full bg-gradient-to-br ${color} p-1 shadow-md`}>
                  <div className="h-full w-full rounded-full border-4 border-white dark:border-[#0a0f1c] bg-white dark:bg-[#151b2b] flex items-center justify-center overflow-hidden relative">
                    {person.imageUrl ? (
                      <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="h-12 w-12 text-orange-200 dark:text-white/30 absolute" />
                    )}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-blue-950 dark:text-white mb-2">{person.name}</h4>
                <p className="text-sm font-bold text-orange-500 dark:text-orange-400">{person.role}</p>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* POSTINGAN TERBARU SECTION */}
      <section className="py-24 bg-orange-50/50 dark:bg-[#050810] border-t border-orange-100 dark:border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold tracking-widest text-orange-600 dark:text-orange-500 uppercase mb-3 flex items-center gap-2">
                <Newspaper className="h-4 w-4" /> Informasi RQA
              </h2>
              <h3 className="text-3xl font-bold text-blue-950 dark:text-white sm:text-4xl">Berita & Kegiatan Terbaru</h3>
            </div>
            <Link href="/berita?kategori=rqa" className="hidden md:inline-flex items-center gap-2 font-bold text-orange-600 dark:text-orange-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Lihat Semua <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {recentPosts.length > 0 ? recentPosts.map((post, i) => (
              <div key={post.id} className="group flex flex-col rounded-3xl bg-white dark:bg-white/5 border border-orange-100 dark:border-white/10 shadow-lg shadow-orange-900/5 overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl dark:hover:bg-white/10">
                <div className="relative h-48 w-full overflow-hidden bg-orange-100 dark:bg-slate-800">
                  <div className="absolute inset-0 bg-orange-900/20 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                  <img src={post.imageUrl || "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=600&auto=format&fit=crop"} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 z-20 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h4 className="text-xl font-bold text-blue-950 dark:text-white mb-4 line-clamp-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {post.title}
                  </h4>
                  <Link href={`/berita/${post.slug}`} className="mt-auto inline-flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                    Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12 text-slate-500">
                Belum ada berita yang dipublikasikan.
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
