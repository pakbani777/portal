import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function Footer() {
  const settingsDb = await prisma.siteSetting.findMany({
    where: { group: 'GLOBAL' }
  });

  const getSetting = (key: string, defaultValue: string) => {
    return settingsDb.find(s => s.key === key)?.value || defaultValue;
  };

  const logoUrl = getSetting('GLOBAL_LOGO', '');
  const heroDesc = getSetting('GLOBAL_HERO_DESC', "Yayasan Ahmad Surur Cendekia mendidik generasi Qur'ani yang berakhlak mulia, cerdas, dan mandiri untuk masa depan yang gemilang.");
  const phone = getSetting('GLOBAL_PHONE', "+62 812-3456-7890");
  const email = getSetting('GLOBAL_EMAIL', "info@yayasanasca.org");
  const address = getSetting('GLOBAL_ALAMAT_TEXT', "Jl. Pendidikan No. 1, Komplek Pesantren Cendekia, Jawa Barat");
  const ig = getSetting('GLOBAL_IG', "");
  const fb = getSetting('GLOBAL_FB', "");

  return (
    <footer className="bg-white dark:bg-[#050810] text-blue-900 dark:text-slate-300 border-t border-blue-100 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 h-[300px] w-[300px] bg-blue-100/50 dark:bg-blue-900/20 blur-[100px] pointer-events-none rounded-full"></div>
      
      <div className="container relative z-10 mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-6 flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo ASCA" className="h-10 w-auto object-contain" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20">
                  <span className="text-xl font-black">A</span>
                </div>
              )}
              <span className="text-2xl font-extrabold text-blue-950 dark:text-white tracking-tight">ASCA</span>
            </Link>
            <p className="text-sm text-blue-800/80 dark:text-slate-400 leading-relaxed mb-6 font-medium">
              {heroDesc}
            </p>
            {(ig || fb) && (
              <div className="flex gap-4">
                {ig && (
                  <a href={ig} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 dark:bg-slate-800 rounded-lg text-blue-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-white transition-colors font-bold text-xs flex items-center justify-center">
                    IG
                  </a>
                )}
                {fb && (
                  <a href={fb} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 dark:bg-slate-800 rounded-lg text-blue-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-white transition-colors font-bold text-xs flex items-center justify-center">
                    FB
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-blue-950 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-500 rounded-full inline-block"></span>
              Tautan Cepat
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="/" className="hover:text-orange-500 transition-colors">Beranda</Link></li>
              <li><Link href="/#tentang" className="hover:text-orange-500 transition-colors">Tentang Kami</Link></li>
              <li><Link href="/rumah-quran" className="hover:text-orange-500 transition-colors">Rumah Qur'an</Link></li>
              <li><Link href="/sd-quran" className="hover:text-orange-500 transition-colors">SD Qur'an</Link></li>
              <li><Link href="/admin" className="text-blue-600 dark:text-blue-500 hover:text-blue-500 transition-colors">Portal Admin</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-blue-950 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-orange-500 rounded-full inline-block"></span>
              Hubungi Kami
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-white/5 text-orange-500 dark:text-orange-400 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="mt-1 text-blue-900/80 dark:text-slate-400 leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-blue-400 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-blue-900/80 dark:text-slate-400">{phone}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-blue-400 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-blue-900/80 dark:text-slate-400">{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-blue-100 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm font-medium text-blue-800/60 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} Yayasan Ahmad Surur Cendekia (ASCA). Hak Cipta Dilindungi.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Privasi</Link>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
