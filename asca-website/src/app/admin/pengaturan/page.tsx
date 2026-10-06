import { Settings, Globe, BookOpen, GraduationCap, Save } from 'lucide-react';
import Link from 'next/link';
import { saveSettings } from './actions';
import prisma from '@/lib/prisma';
import ImageUpload from '@/components/admin/ImageUpload';
import AlumniListBuilder from '@/components/admin/AlumniListBuilder';

export const metadata = {
  title: 'Pengaturan Tampilan | ASCA Admin',
};

export default async function PengaturanPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.tab || 'utama';

  // Ambil data pengaturan dari database
  const settingsDb = await prisma.siteSetting.findMany({
    where: {
      group: currentTab === 'utama' ? 'GLOBAL' : currentTab === 'rqa' ? 'RQA' : 'SDQu',
    }
  });

  // Helper untuk mendapatkan nilai setting atau default
  const getSetting = (key: string, defaultValue: string) => {
    return settingsDb.find(s => s.key === key)?.value || defaultValue;
  };

  const tabs = [
    { id: 'utama', label: 'Halaman Utama', icon: Globe },
    { id: 'frontend', label: 'Tampilan Beranda', icon: Settings },
    { id: 'rqa', label: "Rumah Qur'an", icon: BookOpen },
    { id: 'sdqu', label: "SD Qur'an", icon: GraduationCap },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Settings className="h-8 w-8 text-blue-500" /> Pengaturan Tampilan
        </h1>
        <p className="text-slate-500 mt-2">
          Kelola teks, deskripsi, dan informasi yang ditampilkan pada halaman publik secara dinamis.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Navigasi Tab (Kiri) */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm sticky top-24">
            <nav className="flex flex-col p-2">
              {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <Link
                    key={tab.id}
                    href={`/admin/pengaturan?tab=${tab.id}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' 
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    <tab.icon className={`h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Area Formulir (Kanan) */}
        <div className="flex-1">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
            <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                Konfigurasi {currentTab === 'utama' ? 'Global / Utama' : currentTab === 'rqa' ? "Rumah Qur'an" : "SD Qur'an"}
              </h2>
            </div>

            <form action={saveSettings} className="space-y-6">
              <input type="hidden" name="tabGroup" value={currentTab} />
              
              {currentTab === 'utama' && (
                <>
                  <div className="space-y-2 mb-6">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Susunan Menu Navigasi (Tulis NamaMenu|Link, pisahkan dengan baris baru/Enter)</label>
                    <textarea name="GLOBAL_NAV_MENU" defaultValue={getSetting('GLOBAL_NAV_MENU', "Beranda|/\nTentang|/#tentang\nLembaga|/#lembaga\nBerita|/berita\nKontak|/#kontak")} rows={5} placeholder="Beranda|/&#10;Tentang|/#tentang" className="w-full font-mono text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gunakan format <b>Nama Menu|/link-tujuan</b> (contoh: <i>Beranda|/</i> atau <i>Tentang|/#tentang</i>).</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Slogan / Judul Utama (Hero)</label>
                    <input name="GLOBAL_HERO_TITLE" defaultValue={getSetting('GLOBAL_HERO_TITLE', "Membangun Generasi Qur'ani, Cerdas & Mandiri")} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Deskripsi Singkat Yayasan</label>
                    <textarea name="GLOBAL_HERO_DESC" defaultValue={getSetting('GLOBAL_HERO_DESC', "Yayasan Ahmad Surur Cendekia (ASCA) adalah lembaga pendidikan Islam yang berfokus pada integrasi ilmu pengetahuan umum dan pemahaman Al-Qur'an mendalam.")} rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Visi Yayasan</label>
                    <textarea name="GLOBAL_VISI" defaultValue={getSetting('GLOBAL_VISI', "Menjadi lembaga pendidikan terdepan yang melahirkan generasi Rabbani yang hafal Al-Qur'an, berakhlak mulia, dan unggul dalam IPTEK.")} rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Misi Yayasan (Gunakan tanda titik koma ';' untuk memisahkan poin)</label>
                    <textarea name="GLOBAL_MISI" defaultValue={getSetting('GLOBAL_MISI', "Menyelenggarakan pendidikan tahfidz berkualitas;Mengintegrasikan kurikulum nasional dan diniyah;Membentuk karakter santri berbasis adab Islami")} rows={4} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tautan Video Background Hero (URL)</label>
                    <input name="GLOBAL_HERO_VIDEO" defaultValue={getSetting('GLOBAL_HERO_VIDEO', "https://www.w3schools.com/html/mov_bbb.mp4")} type="url" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <ImageUpload 
                      name="GLOBAL_LOGO" 
                      label="Logo Yayasan (Menu Frontend)" 
                      defaultValue={getSetting('GLOBAL_LOGO', "/logo.png")} 
                    />
                    <ImageUpload 
                      name="GLOBAL_FAVICON" 
                      label="Favicon (Ikon Tab Browser)" 
                      defaultValue={getSetting('GLOBAL_FAVICON', "/favicon.ico")} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Alamat Lengkap (Teks)</label>
                    <textarea name="GLOBAL_ALAMAT_TEXT" defaultValue={getSetting('GLOBAL_ALAMAT_TEXT', "Jl. Pendidikan No. 1, Komplek Pesantren Cendekia, Kota Cendekia, Provinsi Jawa Barat, Indonesia 12345")} rows={2} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nomor Telepon / WhatsApp</label>
                      <input name="GLOBAL_PHONE" defaultValue={getSetting('GLOBAL_PHONE', "+62 812-3456-7890")} type="text" placeholder="+62 8xx..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Alamat Email</label>
                      <input name="GLOBAL_EMAIL" defaultValue={getSetting('GLOBAL_EMAIL', "info@yayasanasca.org")} type="email" placeholder="email@domain.com" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Link Instagram (Opsional)</label>
                      <input name="GLOBAL_IG" defaultValue={getSetting('GLOBAL_IG', "")} type="url" placeholder="https://instagram.com/..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Link Facebook (Opsional)</label>
                      <input name="GLOBAL_FB" defaultValue={getSetting('GLOBAL_FB', "")} type="url" placeholder="https://facebook.com/..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Link YouTube (Opsional)</label>
                      <input name="GLOBAL_YOUTUBE" defaultValue={getSetting('GLOBAL_YOUTUBE', "")} type="url" placeholder="https://youtube.com/..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Link TikTok (Opsional)</label>
                      <input name="GLOBAL_TIKTOK" defaultValue={getSetting('GLOBAL_TIKTOK', "")} type="url" placeholder="https://tiktok.com/..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Link WhatsApp (Untuk tombol Hubungi via WA di Navbar)</label>
                    <input name="GLOBAL_WA_LINK" defaultValue={getSetting('GLOBAL_WA_LINK', "https://wa.me/6281234567890")} type="url" placeholder="https://wa.me/628..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Link Google Maps (Embed URL)</label>
                    <textarea name="GLOBAL_MAPS_URL" defaultValue={getSetting('GLOBAL_MAPS_URL', "https://www.google.com/maps/embed?pb=...")} rows={2} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                </>
              )}

              {currentTab === 'frontend' && (
                <>
                  <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Statistik Yayasan</h3>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Santri RQA</label>
                      <input name="FRONTEND_STAT_RQA" defaultValue={getSetting('FRONTEND_STAT_RQA', "850+")} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Siswa SDQu</label>
                      <input name="FRONTEND_STAT_SDQu" defaultValue={getSetting('FRONTEND_STAT_SDQu', "650+")} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Staff dan Pengajar</label>
                      <input name="FRONTEND_STAT_GURU" defaultValue={getSetting('FRONTEND_STAT_GURU', "120+")} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Jumlah Gedung</label>
                      <input name="FRONTEND_STAT_GEDUNG" defaultValue={getSetting('FRONTEND_STAT_GEDUNG', "5")} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>

                  <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-2 mt-10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dokumentasi (Galeri Halaman Depan)</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <ImageUpload 
                      name="FRONTEND_DOC_1" 
                      label="Foto Utama (Besar)" 
                      defaultValue={getSetting('FRONTEND_DOC_1', "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop")} 
                    />
                    <ImageUpload 
                      name="FRONTEND_DOC_2" 
                      label="Foto Samping 1" 
                      defaultValue={getSetting('FRONTEND_DOC_2', "https://images.unsplash.com/photo-1584553421349-355cbcaaf333?q=80&w=600&auto=format&fit=crop")} 
                    />
                    <ImageUpload 
                      name="FRONTEND_DOC_3" 
                      label="Foto Samping 2" 
                      defaultValue={getSetting('FRONTEND_DOC_3', "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop")} 
                    />
                  </div>

                  <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-2 mt-10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Logo Lembaga (Kartu Beranda)</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <ImageUpload 
                      name="FRONTEND_RQA_LOGO" 
                      label="Logo Menu Rumah Qur'an" 
                      defaultValue={getSetting('FRONTEND_RQA_LOGO', "")} 
                      placeholder="Opsional: Biarkan kosong jika ingin icon buku..."
                    />
                    <ImageUpload 
                      name="FRONTEND_SDQu_LOGO" 
                      label="Logo Menu SD Qur'an" 
                      defaultValue={getSetting('FRONTEND_SDQu_LOGO', "")} 
                      placeholder="Opsional: Biarkan kosong jika ingin icon topi toga..."
                    />
                  </div>

                  <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-2 mt-10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Jejak Lulusan (Alumni)</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Atur daftar jejak lulusan di sini. Anda bisa memasukkan nama, jabatan/kampus, dan mengunggah foto.</p>
                    <AlumniListBuilder 
                      name="FRONTEND_ALUMNI_LOGOS"
                      defaultValue={getSetting('FRONTEND_ALUMNI_LOGOS', "Universitas Indonesia||https://upload.wikimedia.org/wikipedia/id/thumb/0/0b/Makara_of_Universitas_Indonesia.svg/400px-Makara_of_Universitas_Indonesia.svg.png\nInstitut Teknologi Bandung||https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Bandung_Institute_of_Technology_logo.svg/400px-Bandung_Institute_of_Technology_logo.svg.png\nUniversitas Gadjah Mada||https://upload.wikimedia.org/wikipedia/id/thumb/5/53/Universitas_Gadjah_Mada_logo.svg/400px-Universitas_Gadjah_Mada_logo.svg.png\nAl-Azhar University||https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Al-Azhar_University_logo.svg/400px-Al-Azhar_University_logo.svg.png\nUniversitas Islam Madinah||https://upload.wikimedia.org/wikipedia/id/thumb/7/7b/Logo_Universitas_Islam_Madinah.png/400px-Logo_Universitas_Islam_Madinah.png")} 
                    />
                  </div>
                </>
              )}

              {currentTab === 'rqa' && (
                <>
                  <ImageUpload 
                    name="RQA_LOGO" 
                    label="Logo Rumah Qur'an" 
                    defaultValue={getSetting('RQA_LOGO', "")} 
                    placeholder="Opsional: Biarkan kosong jika ingin icon bawaan..."
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Slogan Rumah Qur'an</label>
                    <input name="RQA_HERO_TITLE" defaultValue={getSetting('RQA_HERO_TITLE', "Pusat Bimbingan Tahsin & Tahfidz Bersanad")} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Deskripsi Program Utama</label>
                    <textarea name="RQA_HERO_DESC" defaultValue={getSetting('RQA_HERO_DESC', "Kami membimbing setiap langkah santri dari Iqro hingga menjadi Hafidz/Hafidzah yang mutqin.")} rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Visi Rumah Qur'an</label>
                    <textarea name="RQA_VISI" defaultValue={getSetting('RQA_VISI', "Menjadi lembaga tahfidz percontohan yang melahirkan generasi Qur'ani yang mutqin dan berakhlakul karimah.")} rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Misi Rumah Qur'an (Gunakan tanda titik koma ';' untuk memisahkan poin)</label>
                    <textarea name="RQA_MISI" defaultValue={getSetting('RQA_MISI', "Menerapkan metode tahsin bersanad;Membina hafalan dengan sistem mutaba'ah yaumiyyah;Menanamkan adab dan akhlak Islam")} rows={4} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Foto Galeri RQA (Masukkan URL gambar, pisahkan dengan Enter/Baris Baru)</label>
                    <textarea name="RQA_GALLERY" defaultValue={getSetting('RQA_GALLERY', "https://images.unsplash.com/photo-1609599006353-e629aaab3125\nhttps://images.unsplash.com/photo-1584553421349-355ceacddbe6")} rows={4} placeholder="https://contoh.com/gambar1.jpg&#10;https://contoh.com/gambar2.jpg" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"></textarea>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Pendaftaran Dibuka?</label>
                      <select name="RQA_REG_OPEN" defaultValue={getSetting('RQA_REG_OPEN', "false")} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white">
                        <option value="true">Buka (Tampilkan Form)</option>
                        <option value="false">Tutup</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Informasi Waktu Pendaftaran</label>
                      <input name="RQA_REG_INFO" defaultValue={getSetting('RQA_REG_INFO', "Gelombang 1: 1 - 30 November 2026")} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </>
              )}

              {currentTab === 'sdqu' && (
                <>
                  <ImageUpload 
                    name="SDQu_LOGO" 
                    label="Logo SD Qur'an" 
                    defaultValue={getSetting('SDQu_LOGO', "")} 
                    placeholder="Opsional: Biarkan kosong jika ingin icon bawaan..."
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Slogan SD Qur'an</label>
                    <input name="SDQu_HERO_TITLE" defaultValue={getSetting('SDQu_HERO_TITLE', "Pendidikan Dasar Unggulan Integrasi Kurikulum")} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Deskripsi Sekolah</label>
                    <textarea name="SDQu_HERO_DESC" defaultValue={getSetting('SDQu_HERO_DESC', "Memadukan Kurikulum Nasional (Kemdikbud) dengan Kurikulum Kepesantrenan untuk mencetak generasi cerdas, mandiri, dan berakhlak mulia.")} rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Visi SD Qur'an</label>
                    <textarea name="SDQu_VISI" defaultValue={getSetting('SDQu_VISI', "Menjadi Sekolah Dasar terdepan dalam mencetak generasi penerus yang cerdas secara akademik dan kokoh dalam aqidah serta akhlak Islami.")} rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Misi SD Qur'an (Gunakan tanda titik koma ';' untuk memisahkan poin)</label>
                    <textarea name="SDQu_MISI" defaultValue={getSetting('SDQu_MISI', "Mengintegrasikan kurikulum nasional dengan nilai Islami;Membudayakan literasi dan numerasi sejak dini;Menggali potensi dan bakat siswa secara optimal")} rows={4} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>

                  <div className="mb-6 mt-10 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sistem Pembelajaran (4 Item)</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Item 1: Judul</label>
                        <input name="SDQu_SISTEM_TITLE_1" defaultValue={getSetting('SDQu_SISTEM_TITLE_1', "Kurikulum Nasional")} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Item 1: Deskripsi</label>
                        <textarea name="SDQu_SISTEM_DESC_1" defaultValue={getSetting('SDQu_SISTEM_DESC_1', "Penerapan Kurikulum Merdeka secara utuh yang berfokus pada pengembangan literasi dan numerasi tingkat dasar.")} rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                      </div>
                    </div>

                    <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Item 2: Judul</label>
                        <input name="SDQu_SISTEM_TITLE_2" defaultValue={getSetting('SDQu_SISTEM_TITLE_2', "Kurikulum Diniyah")} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Item 2: Deskripsi</label>
                        <textarea name="SDQu_SISTEM_DESC_2" defaultValue={getSetting('SDQu_SISTEM_DESC_2', "Pendidikan agama Islam intensif meliputi fiqih, aqidah akhlak, sejarah kebudayaan Islam, dan bahasa Arab dasar.")} rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                      </div>
                    </div>

                    <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Item 3: Judul</label>
                        <input name="SDQu_SISTEM_TITLE_3" defaultValue={getSetting('SDQu_SISTEM_TITLE_3', "Program Tahfidz")} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Item 3: Deskripsi</label>
                        <textarea name="SDQu_SISTEM_DESC_3" defaultValue={getSetting('SDQu_SISTEM_DESC_3', "Target hafalan minimal 3 Juz Al-Qur'an dan penguasaan ilmu tajwid saat siswa lulus sekolah dasar.")} rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                      </div>
                    </div>

                    <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Item 4: Judul</label>
                        <input name="SDQu_SISTEM_TITLE_4" defaultValue={getSetting('SDQu_SISTEM_TITLE_4', "Pembinaan Karakter")} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Item 4: Deskripsi</label>
                        <textarea name="SDQu_SISTEM_DESC_4" defaultValue={getSetting('SDQu_SISTEM_DESC_4', "Pembentukan adab Islami dan kemandirian melalui program pembiasaan ibadah harian dan kegiatan ekstrakurikuler.")} rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Foto Galeri SDQu (Masukkan URL gambar, pisahkan dengan Enter/Baris Baru)</label>
                    <textarea name="SDQu_GALLERY" defaultValue={getSetting('SDQu_GALLERY', "https://images.unsplash.com/photo-1588072432836-e10032774350\nhttps://images.unsplash.com/photo-1577896851231-70ef18881754")} rows={4} placeholder="https://contoh.com/gambar1.jpg&#10;https://contoh.com/gambar2.jpg" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"></textarea>
                  </div>
                  <div className="mb-6 mt-10 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pengaturan Gelombang PPDB (1, 2, 3)</h3>
                  </div>

                  {[1, 2, 3].map((g) => (
                    <div key={g} className="space-y-4 p-4 border border-blue-200 dark:border-slate-700 rounded-xl mb-6 bg-blue-50/20 dark:bg-slate-800/20">
                      <h4 className="font-bold text-blue-900 dark:text-blue-400">Pengaturan Gelombang {g}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Status Pendaftaran</label>
                          <select name={`SDQu_G${g}_OPEN`} defaultValue={getSetting(`SDQu_G${g}_OPEN`, "false")} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white">
                            <option value="true">Buka</option>
                            <option value="false">Tutup</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Waktu Pendaftaran</label>
                          <input name={`SDQu_G${g}_WAKTU`} defaultValue={getSetting(`SDQu_G${g}_WAKTU`, g === 1 ? "1 Sep - 31 Okt" : g === 2 ? "1 Nov - 31 Des" : "1 Jan - Kuota Habis")} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Link Download Syarat & Rincian Biaya</label>
                          <input name={`SDQu_G${g}_BROSUR`} defaultValue={getSetting(`SDQu_G${g}_BROSUR`, "")} type="url" placeholder="https://..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30">
                  <Save className="h-5 w-5" /> Simpan Pengaturan
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
