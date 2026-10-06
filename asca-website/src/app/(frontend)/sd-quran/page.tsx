import Link from "next/link";
import { GraduationCap, CheckCircle2, ChevronRight, Microscope, Laptop, Library, Palette, Users, Newspaper, ArrowRight, Calendar, Image as ImageIcon } from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "SD Qur'an Assurur | Yayasan ASCA",
  description: "Sekolah Dasar Islam Terpadu unggulan dari Yayasan Ahmad Surur Cendekia.",
};

export default async function SDQuranPage() {
  const teachers = await prisma.teacher.findMany({
    where: { institution: "SDQu" },
    orderBy: { createdAt: 'asc' }
  });

  const recentPosts = await prisma.post.findMany({
    where: { institution: "SDQu" },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const settingsDb = await prisma.siteSetting.findMany({
    where: { group: 'SDQu' }
  });

  const getSetting = (key: string, defaultValue: string) => {
    return settingsDb.find(s => s.key === key)?.value || defaultValue;
  };

  const heroTitle = getSetting('SDQu_HERO_TITLE', "Pendidikan Dasar Unggulan Integrasi Kurikulum");
  const heroDesc = getSetting('SDQu_HERO_DESC', "Memadukan Kurikulum Nasional (Kemdikbud) dengan Kurikulum Kepesantrenan untuk mencetak generasi cerdas, mandiri, dan berakhlak mulia.");
  
  const visi = getSetting('SDQu_VISI', "Menjadi Sekolah Dasar terdepan dalam mencetak generasi penerus yang cerdas secara akademik dan kokoh dalam aqidah serta akhlak Islami.");
  const misiRaw = getSetting('SDQu_MISI', "Mengintegrasikan kurikulum nasional dengan nilai Islami;Membudayakan literasi dan numerasi sejak dini;Menggali potensi dan bakat siswa secara optimal");
  const misiArray = misiRaw.split(';').filter(m => m.trim() !== '');

  const sysTitle1 = getSetting('SDQu_SISTEM_TITLE_1', "Kurikulum Nasional");
  const sysDesc1 = getSetting('SDQu_SISTEM_DESC_1', "Penerapan Kurikulum Merdeka secara utuh yang berfokus pada pengembangan literasi dan numerasi tingkat dasar.");
  
  const sysTitle2 = getSetting('SDQu_SISTEM_TITLE_2', "Kurikulum Diniyah");
  const sysDesc2 = getSetting('SDQu_SISTEM_DESC_2', "Pendidikan agama Islam intensif meliputi fiqih, aqidah akhlak, sejarah kebudayaan Islam, dan bahasa Arab dasar.");
  
  const sysTitle3 = getSetting('SDQu_SISTEM_TITLE_3', "Program Tahfidz");
  const sysDesc3 = getSetting('SDQu_SISTEM_DESC_3', "Target hafalan minimal 3 Juz Al-Qur'an dan penguasaan ilmu tajwid saat siswa lulus sekolah dasar.");
  
  const sysTitle4 = getSetting('SDQu_SISTEM_TITLE_4', "Pembinaan Karakter");
  const sysDesc4 = getSetting('SDQu_SISTEM_DESC_4', "Pembentukan adab Islami dan kemandirian melalui program pembiasaan ibadah harian dan kegiatan ekstrakurikuler.");

  const galleryRaw = getSetting('SDQu_GALLERY', "https://images.unsplash.com/photo-1588072432836-e10032774350\nhttps://images.unsplash.com/photo-1577896851231-70ef18881754");
  const galleryArray = galleryRaw.split('\n').map(s => s.trim()).filter(Boolean);

  return (
    <div className="pt-24 pb-12 bg-white dark:bg-[#0a0f1c] min-h-screen transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-blue-50/50 dark:bg-[#050810] border-b border-blue-100 dark:border-white/5">
        <div className="absolute top-0 left-0 h-[400px] w-[400px] bg-blue-200/50 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 mb-6">
            <Link href="/" className="hover:text-orange-500 transition-colors">Beranda</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Lembaga</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-orange-600 dark:text-orange-400">SD Qur'an</span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-extrabold text-blue-950 dark:text-white sm:text-5xl lg:text-6xl mb-6 leading-tight">
                SD Qur'an <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Assurur</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-800/80 dark:text-slate-300 font-medium leading-relaxed mb-8">
                {heroTitle}. {heroDesc}
              </p>
              <Link href="/pendaftaran/sd-quran" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)] transition-all hover:bg-orange-500 hover:shadow-[0_4px_20px_rgba(249,115,22,0.4)]">
                Pendaftaran Siswa Baru
              </Link>
            </div>
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-blue-100 dark:border-white/10 group h-[400px]">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop" alt="Kegiatan SD" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* VISI MISI SECTION */}
      <section className="py-24 bg-white dark:bg-[#0a0f1c]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            <div className="relative rounded-3xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-10 shadow-lg shadow-blue-900/5 dark:shadow-none">
              <Microscope className="mb-6 h-12 w-12 text-blue-600 dark:text-blue-400" />
              <h2 className="mb-4 text-3xl font-bold text-blue-950 dark:text-white">Visi SDQu</h2>
              <p className="text-xl italic text-blue-800/80 dark:text-blue-100 leading-relaxed">
                "{visi}"
              </p>
            </div>

            <div className="relative rounded-3xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-10 shadow-lg shadow-blue-900/5 dark:shadow-none">
              <CheckCircle2 className="mb-6 h-12 w-12 text-blue-600 dark:text-blue-400" />
              <h2 className="mb-6 text-3xl font-bold text-blue-950 dark:text-white">Misi SDQu</h2>
              <ul className="space-y-4">
                {misiArray.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-blue-900/80 dark:text-blue-100 font-medium">
                    <CheckCircle2 className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-orange-600 dark:text-orange-500 uppercase mb-3">Sistem Pembelajaran</h2>
            <h3 className="text-3xl font-bold text-blue-950 dark:text-white sm:text-4xl">Integrasi Kurikulum Unggulan</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="rounded-3xl bg-white dark:bg-white/5 border border-blue-100 dark:border-white/10 p-10 shadow-lg shadow-blue-900/5 hover:-translate-y-1 transition-transform">
              <h4 className="text-2xl font-bold text-blue-950 dark:text-white mb-6 border-b border-blue-100 dark:border-white/10 pb-4">{sysTitle1}</h4>
              <p className="font-medium text-blue-900/80 dark:text-slate-300 leading-relaxed text-lg">
                {sysDesc1}
              </p>
            </div>

            <div className="rounded-3xl bg-white dark:bg-white/5 border border-orange-100 dark:border-white/10 p-10 shadow-lg shadow-orange-900/5 hover:-translate-y-1 transition-transform">
              <h4 className="text-2xl font-bold text-blue-950 dark:text-white mb-6 border-b border-orange-100 dark:border-white/10 pb-4">{sysTitle2}</h4>
              <p className="font-medium text-blue-900/80 dark:text-slate-300 leading-relaxed text-lg">
                {sysDesc2}
              </p>
            </div>

            <div className="rounded-3xl bg-white dark:bg-white/5 border border-indigo-100 dark:border-white/10 p-10 shadow-lg shadow-indigo-900/5 hover:-translate-y-1 transition-transform">
              <h4 className="text-2xl font-bold text-blue-950 dark:text-white mb-6 border-b border-indigo-100 dark:border-white/10 pb-4">{sysTitle3}</h4>
              <p className="font-medium text-blue-900/80 dark:text-slate-300 leading-relaxed text-lg">
                {sysDesc3}
              </p>
            </div>

            <div className="rounded-3xl bg-white dark:bg-white/5 border border-rose-100 dark:border-white/10 p-10 shadow-lg shadow-rose-900/5 hover:-translate-y-1 transition-transform">
              <h4 className="text-2xl font-bold text-blue-950 dark:text-white mb-6 border-b border-rose-100 dark:border-white/10 pb-4">{sysTitle4}</h4>
              <p className="font-medium text-blue-900/80 dark:text-slate-300 leading-relaxed text-lg">
                {sysDesc4}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FACILITIES SECTION */}
      <section className="py-24 bg-blue-50/30 dark:bg-[#050810] border-y border-blue-100 dark:border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-500 uppercase mb-3">Fasilitas</h2>
            <h3 className="text-3xl font-bold text-blue-950 dark:text-white sm:text-4xl">Fasilitas Pendukung Belajar</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Lab Komputer", icon: Laptop, color: "text-blue-500" },
              { title: "Lab Sains Dasar", icon: Microscope, color: "text-orange-500" },
              { title: "Perpustakaan", icon: Library, color: "text-indigo-500" },
              { title: "Ruang Kesenian", icon: Palette, color: "text-rose-500" }
            ].map((fac, i) => (
              <div key={i} className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-blue-100/50 dark:border-white/10 text-center shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="mx-auto h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <fac.icon className={`h-8 w-8 ${fac.color}`} />
                </div>
                <h4 className="font-bold text-blue-950 dark:text-white">{fac.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERI SECTION */}
      {galleryArray.length > 0 && (
        <section className="py-24 bg-white dark:bg-[#0a0f1c]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                <ImageIcon className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-blue-950 dark:text-white sm:text-4xl mb-6">Galeri Kegiatan</h2>
              <p className="text-lg text-blue-800/70 dark:text-slate-400 font-medium">
                Momen-momen berharga dalam proses belajar mengajar dan kegiatan siswa-siswi SD Qur'an Assurur.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryArray.map((url, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden shadow-lg border border-blue-100 dark:border-white/10 group aspect-[4/3]">
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
            <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-500 uppercase mb-3">Dewan Guru</h2>
            <h3 className="text-3xl font-bold text-blue-950 dark:text-white sm:text-4xl">Tenaga Pengajar SD Qur'an</h3>
            <p className="mt-4 text-lg font-medium text-blue-800/70 dark:text-slate-400 max-w-2xl mx-auto">
              Dididik oleh pahlawan tanpa tanda jasa yang profesional, sabar, dan memiliki dedikasi tinggi terhadap pendidikan anak.
            </p>
          </div>

          <div className="flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pb-8 sm:pb-0 scrollbar-hide">
            {teachers.map((person, i) => {
              const bgColors = ["from-blue-500 to-indigo-600", "from-blue-400 to-blue-500", "from-indigo-400 to-indigo-500", "from-cyan-500 to-blue-500"];
              const color = bgColors[i % bgColors.length];
              return (
              <div key={person.id} className="w-full sm:w-auto shrink-0 snap-center sm:snap-align-none group relative overflow-hidden rounded-3xl bg-blue-50/30 dark:bg-white/5 border border-blue-100 dark:border-white/10 p-8 text-center shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:bg-white/10">
                <div className={`mx-auto mb-6 h-32 w-32 rounded-full bg-gradient-to-br ${color} p-1 shadow-md`}>
                  <div className="h-full w-full rounded-full border-4 border-white dark:border-[#0a0f1c] bg-white dark:bg-[#151b2b] flex items-center justify-center overflow-hidden relative">
                    {person.imageUrl ? (
                      <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="h-12 w-12 text-blue-200 dark:text-white/30 absolute" />
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
      <section className="py-24 bg-blue-50/50 dark:bg-[#050810] border-t border-blue-100 dark:border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-500 uppercase mb-3 flex items-center gap-2">
                <Newspaper className="h-4 w-4" /> Informasi SD
              </h2>
              <h3 className="text-3xl font-bold text-blue-950 dark:text-white sm:text-4xl">Berita & Kegiatan Terbaru</h3>
            </div>
            <Link href="/berita?kategori=sd" className="hidden md:inline-flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Lihat Semua <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {recentPosts.length > 0 ? recentPosts.map((post, i) => (
              <div key={post.id} className="group flex flex-col rounded-3xl bg-white dark:bg-white/5 border border-blue-100 dark:border-white/10 shadow-lg shadow-blue-900/5 overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl dark:hover:bg-white/10">
                <div className="relative h-48 w-full overflow-hidden bg-blue-100 dark:bg-slate-800">
                  <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                  <img src={post.imageUrl || "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop"} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 z-20 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h4 className="text-xl font-bold text-blue-950 dark:text-white mb-4 line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h4>
                  <Link href={`/berita/${post.slug}`} className="mt-auto inline-flex items-center gap-2 font-bold text-orange-600 dark:text-orange-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
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
