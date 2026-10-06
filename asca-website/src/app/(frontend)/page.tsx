import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Heart, Sparkles, Users, Target, Compass, CheckCircle2, MapPin, History, Newspaper, MessageSquareQuote, Calendar, Image as ImageIcon } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { institution: "UMUM" },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const teachers = await prisma.teacher.findMany({
    where: { institution: "UMUM" },
    orderBy: { createdAt: 'asc' }
  });

  const testimonials = await prisma.testimonial.findMany({
    where: { institution: "UMUM" },
    orderBy: { createdAt: 'desc' }
  });

  const settingsDb = await prisma.siteSetting.findMany({
    where: { group: 'GLOBAL' }
  });

  const getSetting = (key: string, defaultValue: string) => {
    return settingsDb.find(s => s.key === key)?.value || defaultValue;
  };

  const heroTitle = getSetting('GLOBAL_HERO_TITLE', "Membangun Generasi Qur'ani, Cerdas & Mandiri");
  const heroDesc = getSetting('GLOBAL_HERO_DESC', "Yayasan Ahmad Surur Cendekia (ASCA) adalah lembaga pendidikan Islam yang berfokus pada integrasi ilmu pengetahuan umum dan pemahaman Al-Qur'an mendalam.");
  const heroVideo = getSetting('GLOBAL_HERO_VIDEO', "https://cdn.pixabay.com/video/2020/02/16/32333-392182069_large.mp4");
  const visi = getSetting('GLOBAL_VISI', "Menjadi lembaga pendidikan terdepan yang melahirkan generasi Rabbani yang hafal Al-Qur'an, berakhlak mulia, dan unggul dalam IPTEK.");
  const misiRaw = getSetting('GLOBAL_MISI', "Menyelenggarakan pendidikan tahfidz berkualitas;Mengintegrasikan kurikulum nasional dan diniyah;Membentuk karakter santri berbasis adab Islami");
  const misiArray = misiRaw.split(';').filter(m => m.trim() !== '');

  const statRqa = getSetting('FRONTEND_STAT_RQA', '850+');
  const statSdqa = getSetting('FRONTEND_STAT_SDQu', '650+');
  const statGuru = getSetting('FRONTEND_STAT_GURU', '120+');
  const statGedung = getSetting('FRONTEND_STAT_GEDUNG', '5');

  const doc1 = getSetting('FRONTEND_DOC_1', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop');
  const doc2 = getSetting('FRONTEND_DOC_2', 'https://images.unsplash.com/photo-1584553421349-355cbcaaf333?q=80&w=600&auto=format&fit=crop');
  const doc3 = getSetting('FRONTEND_DOC_3', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop');

  const rqaLogo = getSetting('FRONTEND_RQA_LOGO', '');
  const sdquLogo = getSetting('FRONTEND_SDQu_LOGO', '');
  const alumniLogosRaw = getSetting('FRONTEND_ALUMNI_LOGOS', "Universitas Indonesia||https://upload.wikimedia.org/wikipedia/id/thumb/0/0b/Makara_of_Universitas_Indonesia.svg/400px-Makara_of_Universitas_Indonesia.svg.png\nInstitut Teknologi Bandung||https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Bandung_Institute_of_Technology_logo.svg/400px-Bandung_Institute_of_Technology_logo.svg.png\nUniversitas Gadjah Mada||https://upload.wikimedia.org/wikipedia/id/thumb/5/53/Universitas_Gadjah_Mada_logo.svg/400px-Universitas_Gadjah_Mada_logo.svg.png\nAl-Azhar University||https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Al-Azhar_University_logo.svg/400px-Al-Azhar_University_logo.svg.png\nUniversitas Islam Madinah||https://upload.wikimedia.org/wikipedia/id/thumb/7/7b/Logo_Universitas_Islam_Madinah.png/400px-Logo_Universitas_Islam_Madinah.png");
  const alumniLogos = alumniLogosRaw.split('\n')
    .filter(line => line.trim().includes('|'))
    .map(line => {
      const parts = line.split('|');
      if (parts.length >= 3) {
        return { name: parts[0].trim(), jabatan: parts[1].trim(), img: parts[2].trim() };
      } else {
        return { name: parts[0]?.trim() || '', jabatan: '', img: parts[1]?.trim() || '' };
      }
    });

  return (
    <>
      {/* HERO SECTION WITH BACKGROUND VIDEO */}
      <section className="relative min-h-[90vh] overflow-hidden flex items-center pt-20 transition-colors duration-300">
        
        {/* Background Video Elements */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
            Browser Anda tidak mendukung tag video.
          </video>
          
          <div className="absolute inset-0 bg-white/85 dark:bg-[#0a0f1c]/85 backdrop-blur-[2px] transition-colors duration-300"></div>
          
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-orange-500/10 mix-blend-multiply dark:mix-blend-overlay"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-200 dark:border-orange-500/30 bg-white/80 dark:bg-orange-500/10 px-5 py-2 text-sm font-bold text-orange-600 dark:text-orange-400 shadow-sm backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              <span>{heroTitle}</span>
            </div>
            
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-blue-950 dark:text-white sm:text-6xl lg:text-7xl">
              Yayasan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Ahmad Surur</span> <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400 dark:from-orange-400 dark:to-yellow-400">Cendekia</span> (ASCA)
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-900/80 dark:text-slate-300 sm:text-xl font-medium">
              {heroDesc}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="#lembaga" className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-4 font-bold text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)] dark:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgba(249,115,22,0.4)] sm:w-auto">
                <span>Jelajahi Program</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#tentang" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-blue-200 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 px-8 py-4 font-bold text-blue-900 dark:text-white backdrop-blur-md transition-all hover:bg-white dark:hover:bg-slate-700 sm:w-auto">
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
          
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-3xl p-6 text-center shadow-xl shadow-blue-900/10 hover:-translate-y-2 transition-transform">
                <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-4xl font-extrabold text-blue-950 dark:text-white mb-1">{statRqa}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">Santri RQA</div>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-3xl p-6 text-center shadow-xl shadow-orange-900/10 hover:-translate-y-2 transition-transform">
                <div className="h-14 w-14 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-4xl font-extrabold text-blue-950 dark:text-white mb-1">{statSdqa}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">Siswa SDQu</div>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-3xl p-6 text-center shadow-xl shadow-blue-900/10 hover:-translate-y-2 transition-transform">
                <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-4xl font-extrabold text-blue-950 dark:text-white mb-1">{statGuru}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">Staff & Pengajar</div>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-3xl p-6 text-center shadow-xl shadow-indigo-900/10 hover:-translate-y-2 transition-transform">
                <div className="h-14 w-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-4xl font-extrabold text-blue-950 dark:text-white mb-1">{statGedung}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">Jumlah Gedung</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TENTANG KAMI */}
      <section id="tentang" className="relative bg-blue-50/50 dark:bg-[#050810] py-24 border-t border-blue-100 dark:border-white/5 transition-colors duration-300">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-500 uppercase mb-3">Mengenal ASCA</h2>
            <h3 className="text-4xl font-extrabold text-blue-950 dark:text-white sm:text-5xl mb-6">Tentang Yayasan Kami</h3>
          </div>

          <div className="mx-auto max-w-5xl mb-16 relative rounded-3xl border border-blue-100 dark:border-white/10 bg-white dark:bg-white/5 p-8 sm:p-12 shadow-xl shadow-blue-900/5 dark:shadow-none overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-orange-100 dark:bg-orange-500/10 blur-3xl -z-10"></div>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/20">
                <History className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-blue-950 dark:text-white mb-4">Sejarah Singkat</h4>
                <div className="space-y-4 text-blue-800/70 dark:text-slate-300 font-medium leading-relaxed text-lg">
                  <p>
                    Yayasan Ahmad Surur Cendekia (ASCA) didirikan atas dasar kepedulian mendalam terhadap pendidikan karakter generasi muda di tengah pesatnya perkembangan zaman. Berawal dari majelis taklim kecil di tahun 2010, antusiasme masyarakat yang tinggi mendorong kami untuk meresmikan sebuah lembaga pendidikan terpadu.
                  </p>
                  <p>
                    Pada tahun 2015, Rumah Qur'an Assurur resmi beroperasi sebagai pilar pertama. Seiring berjalannya waktu dan demi menjawab kebutuhan akan pendidikan formal berlandaskan Qur'an, kami membuka jenjang SD Qur'an Assurur yang kini telah meluluskan ratusan alumni berprestasi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            <div className="relative rounded-3xl border border-blue-100 dark:border-blue-500/20 bg-white dark:bg-blue-950/20 p-10 shadow-lg shadow-blue-900/5 dark:shadow-none">
              <Target className="mb-6 h-12 w-12 text-blue-600 dark:text-blue-400" />
              <h2 className="mb-4 text-3xl font-bold text-blue-950 dark:text-white">Visi Yayasan</h2>
              <p className="text-xl italic text-blue-800/80 dark:text-blue-100 leading-relaxed">
                "{visi}"
              </p>
            </div>

            <div className="relative rounded-3xl border border-orange-100 dark:border-orange-500/20 bg-white dark:bg-orange-950/20 p-10 shadow-lg shadow-orange-500/5 dark:shadow-none">
              <Compass className="mb-6 h-12 w-12 text-orange-600 dark:text-orange-400" />
              <h2 className="mb-6 text-3xl font-bold text-blue-950 dark:text-white">Misi Kami</h2>
              <ul className="space-y-4">
                {misiArray.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-blue-900/80 dark:text-orange-50 font-medium">
                    <CheckCircle2 className="h-6 w-6 text-orange-500 dark:text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GALERI FOTO SECTION (NEW) */}
      <section className="relative bg-white dark:bg-[#0a0f1c] py-24 transition-colors duration-300 border-t border-blue-50 dark:border-white/5">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-bold tracking-widest text-orange-600 dark:text-orange-500 uppercase mb-3 flex items-center justify-center gap-2">
              <ImageIcon className="h-4 w-4" /> Dokumentasi
            </h2>
            <h3 className="text-4xl font-extrabold text-blue-950 dark:text-white sm:text-5xl mb-6">Galeri Kegiatan</h3>
            <p className="text-lg font-medium text-blue-800/70 dark:text-slate-400">
              Momen-momen berharga dan aktivitas keseharian santri serta siswa-siswi Yayasan Ahmad Surur Cendekia.
            </p>
          </div>

          {/* Masonry / Grid Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group">
              <img src={doc1} alt="Kegiatan Belajar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Kegiatan Belajar Mengajar</span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden group aspect-square">
              <img src={doc2} alt="Membaca Al-Quran" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-orange-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-bold text-center px-4">Tahsin & Tahfidz</span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden group aspect-square">
              <img src={doc3} alt="Pendidikan Karakter" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-bold text-center px-4">Ekstrakurikuler</span>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Link href="#" className="inline-flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Lihat Semua Galeri Foto <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* PROGRAMS SECTION */}
      <section id="lembaga" className="relative bg-blue-50/50 dark:bg-[#0a0f1c] py-24 transition-colors duration-300 border-t border-blue-50 dark:border-white/5">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-bold tracking-widest text-orange-600 dark:text-orange-500 uppercase mb-3">Lembaga Kami</h2>
            <h3 className="text-4xl font-extrabold text-blue-950 dark:text-white sm:text-5xl mb-6">Pendidikan Berjenjang & Terarah</h3>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 max-w-6xl mx-auto">
            <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/50 p-10 shadow-xl shadow-blue-900/5 dark:shadow-none transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 border border-blue-100 dark:border-white/10">
              <div className="relative z-10">
                <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 overflow-hidden">
                  {rqaLogo ? <img src={rqaLogo} alt="Logo RQA" className="w-full h-full object-cover bg-white" /> : <BookOpen className="h-10 w-10" />}
                </div>
                <h4 className="mb-4 text-3xl font-bold text-blue-950 dark:text-white">Rumah Qur'an Assurur</h4>
                <p className="mb-8 text-lg font-medium text-blue-900/70 dark:text-slate-400 leading-relaxed">
                  Bimbingan komprehensif membaca dan menghafal Al-Qur'an (Tahsin & Tahfidz) dengan metode yang adaptif.
                </p>
                <Link href="/rumah-quran" className="inline-flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 hover:text-orange-600 dark:hover:text-orange-400">
                  Pelajari Selengkapnya <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/50 p-10 shadow-xl shadow-orange-900/5 dark:shadow-none transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20 border border-orange-100 dark:border-white/10">
              <div className="relative z-10">
                <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 overflow-hidden">
                  {sdquLogo ? <img src={sdquLogo} alt="Logo SDQu" className="w-full h-full object-cover bg-white" /> : <GraduationCap className="h-10 w-10" />}
                </div>
                <h4 className="mb-4 text-3xl font-bold text-blue-950 dark:text-white">SD Qur'an Assurur</h4>
                <p className="mb-8 text-lg font-medium text-blue-900/70 dark:text-slate-400 leading-relaxed">
                  Sekolah Dasar unggulan bersinergi dengan kurikulum nasional dan sistem kepesantrenan.
                </p>
                <Link href="/sd-quran" className="inline-flex items-center gap-2 font-bold text-orange-600 dark:text-orange-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Pelajari Selengkapnya <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRUKTUR YAYASAN SECTION */}
      <section className="relative bg-white dark:bg-[#050810] py-24 border-y border-blue-100 dark:border-white/5 transition-colors duration-300">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-500 uppercase mb-3">Tim Kami</h2>
            <h3 className="text-4xl font-extrabold text-blue-950 dark:text-white sm:text-5xl mb-6">Dewan Pengurus & Pengajar</h3>
          </div>

          <div className="flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto pb-8 sm:pb-0 scrollbar-hide">
            {teachers.map((person, i) => {
              const bgColors = ["from-blue-500 to-indigo-600", "from-orange-500 to-orange-400", "from-blue-400 to-blue-500", "from-indigo-400 to-indigo-500"];
              const color = bgColors[i % bgColors.length];
              return (
              <div key={person.id} className="w-full sm:w-auto shrink-0 snap-center sm:snap-align-none group relative overflow-hidden rounded-2xl bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 p-6 text-center shadow-sm transition-all hover:-translate-y-2 hover:shadow-lg dark:hover:bg-white/10">
                <div className={`mx-auto mb-6 h-32 w-32 rounded-full bg-gradient-to-br ${color} p-1 shadow-md shadow-black/5 dark:shadow-black/50`}>
                  <div className="h-full w-full rounded-full border-4 border-white dark:border-[#0a0f1c] bg-white dark:bg-[#151b2b] flex items-center justify-center overflow-hidden relative">
                    {person.imageUrl ? (
                      <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="h-12 w-12 text-blue-200 dark:text-white/30 absolute" />
                    )}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-blue-950 dark:text-white mb-1">{person.name}</h4>
                <p className="text-sm font-bold text-orange-500 dark:text-orange-400">{person.role}</p>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* BERITA & POSTINGAN TERBARU SECTION */}
      <section className="relative bg-blue-50/50 dark:bg-[#0a0f1c] py-24 transition-colors duration-300">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold tracking-widest text-orange-600 dark:text-orange-500 uppercase mb-3 flex items-center gap-2">
                <Newspaper className="h-4 w-4" /> Informasi Terkini
              </h2>
              <h3 className="text-4xl font-extrabold text-blue-950 dark:text-white sm:text-5xl">Berita & Artikel</h3>
            </div>
            <Link href="/berita" className="hidden md:inline-flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Lihat Semua Berita <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
            {posts.length > 0 ? posts.map((post, i) => (
              <div key={post.id} className="group flex flex-col rounded-3xl bg-white dark:bg-white/5 border border-blue-100 dark:border-white/10 shadow-lg shadow-blue-900/5 overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl dark:hover:bg-white/10">
                <div className="relative h-48 w-full overflow-hidden bg-blue-100 dark:bg-slate-800">
                  <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                  <img src={post.imageUrl || "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop"} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 z-20 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-md">
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

      {/* TESTIMONI ORANG TUA SECTION */}
      <section className="relative bg-white dark:bg-[#050810] py-24 border-y border-blue-100 dark:border-white/5 transition-colors duration-300 overflow-hidden">
        <MessageSquareQuote className="absolute -top-10 -right-10 h-64 w-64 text-blue-50 dark:text-white/5 rotate-12 pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-bold tracking-widest text-orange-600 dark:text-orange-500 uppercase mb-3">Testimoni</h2>
            <h3 className="text-4xl font-extrabold text-blue-950 dark:text-white sm:text-5xl mb-6">Apa Kata Orang Tua?</h3>
          </div>

          <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto pb-8 md:pb-0 scrollbar-hide">
            {testimonials.length > 0 ? testimonials.map((testimonial, i) => (
              <div key={testimonial.id} className="w-full shrink-0 snap-center md:snap-align-none relative rounded-3xl bg-blue-50/50 dark:bg-white/5 p-8 border border-blue-100 dark:border-white/10 shadow-lg shadow-blue-900/5 dark:shadow-none hover:-translate-y-2 transition-transform">
                <MessageSquareQuote className="absolute top-8 right-8 h-8 w-8 text-blue-200 dark:text-white/10" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white font-bold text-lg shadow-md">
                    {testimonial.parentName.charAt(testimonial.parentName.startsWith('B') || testimonial.parentName.startsWith('I') ? 5 : 0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-950 dark:text-white">{testimonial.parentName}</h4>
                    <p className="text-xs font-bold text-orange-600 dark:text-orange-400">Wali dari {testimonial.studentName}</p>
                  </div>
                </div>
                <p className="text-blue-800/80 dark:text-slate-300 font-medium italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            )) : (
              <div className="col-span-3 text-center py-10 text-slate-500">
                Belum ada testimoni.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ALUMNI LOGOS */}
      {alumniLogos.length > 0 && (
        <section className="bg-blue-50/50 dark:bg-[#0a0f1c] py-24 overflow-hidden transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-widest text-orange-600 dark:text-orange-500 uppercase mb-3">Prestasi</h2>
              <h3 className="text-4xl font-extrabold text-blue-950 dark:text-white sm:text-5xl">Jejak Lulusan Kami</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center max-w-6xl mx-auto">
              {alumniLogos.map((univ, i) => (
                <div key={i} className="group flex flex-col items-center justify-center p-6 rounded-2xl transition-all hover:bg-white dark:hover:bg-slate-800/50 border border-transparent hover:border-blue-100 dark:hover:border-slate-700 w-full h-full grayscale hover:grayscale-0 dark:opacity-80 dark:hover:opacity-100">
                  <div className="h-24 w-24 relative flex items-center justify-center mb-4 bg-white rounded-xl p-2 shadow-sm dark:shadow-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={univ.img} alt={univ.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <p className="text-sm font-bold text-center text-blue-900/60 dark:text-slate-400 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {univ.name}
                  </p>
                  {univ.jabatan && (
                    <p className="text-xs font-semibold text-orange-600 dark:text-orange-500 mt-1 text-center">
                      {univ.jabatan}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MAP SECTION */}
      <section id="kontak" className="relative py-24 bg-white dark:bg-[#050810] border-t border-blue-100 dark:border-white/5 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-8">
                <h2 className="text-sm font-bold tracking-widest text-orange-600 dark:text-orange-500 uppercase mb-3">Lokasi Kami</h2>
                <h3 className="text-4xl font-extrabold text-blue-950 dark:text-white sm:text-5xl mb-6">Kunjungi Yayasan Kami</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 shrink-0 border border-blue-200 dark:border-blue-500/20">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-blue-950 dark:text-white mb-2">Alamat Lengkap</h4>
                    <p className="font-medium text-blue-800/70 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                      {getSetting('GLOBAL_ALAMAT_TEXT', "Jl. Pendidikan No. 1, Komplek Pesantren Cendekia,\nKota Cendekia, Provinsi Jawa Barat, Indonesia 12345")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-[400px] rounded-3xl overflow-hidden border border-blue-200 dark:border-white/10 shadow-xl dark:shadow-2xl dark:shadow-blue-900/20 group">
              <iframe src={getSetting('GLOBAL_MAPS_URL', "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24009033333!2d106.759478!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid")} width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full h-full filter contrast-[1.05] dark:contrast-[1.2] dark:opacity-[0.8] transition-all duration-500 group-hover:filter-none"></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-slate-900 dark:to-[#050810] transition-colors duration-300">
        <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white/10 p-10 backdrop-blur-lg border border-white/20 shadow-2xl">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-5xl">Mari Bergabung Bersama Kami</h2>
            <Link href="/pendaftaran" className="inline-flex items-center justify-center gap-2 rounded-full bg-white dark:bg-gradient-to-r dark:from-orange-500 dark:to-orange-400 px-10 py-5 font-bold text-blue-700 dark:text-white shadow-[0_10px_30px_rgba(255,255,255,0.3)] dark:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all hover:scale-105 hover:bg-orange-50">
              Daftar Sekarang
              <Sparkles className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
