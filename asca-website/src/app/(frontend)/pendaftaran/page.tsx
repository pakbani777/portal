import Link from "next/link";
import { BookOpen, GraduationCap, ArrowRight, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Pendaftaran | Yayasan ASCA",
  description: "Portal pendaftaran peserta didik baru Yayasan Ahmad Surur Cendekia.",
};

export default function PendaftaranGateway() {
  return (
    <div className="pt-24 pb-24 bg-white dark:bg-[#0a0f1c] min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 mb-8">
          <Link href="/" className="hover:text-orange-500 transition-colors">Beranda</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-orange-600 dark:text-orange-400">Pendaftaran</span>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-blue-950 dark:text-white sm:text-5xl mb-6">
            Pilih Lembaga Tujuan
          </h1>
          <p className="text-lg font-medium text-blue-800/70 dark:text-slate-400 max-w-2xl mx-auto">
            Silakan pilih lembaga tujuan pendaftaran Anda untuk melanjutkan ke pengisian formulir data diri.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card RQA */}
          <Link href="/pendaftaran/rumah-quran" className="group relative overflow-hidden rounded-3xl bg-orange-50/50 dark:bg-white/5 border border-orange-100 dark:border-white/10 p-10 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20 block text-center">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-orange-200 to-transparent dark:from-orange-600/20 rounded-bl-full opacity-50"></div>
            
            <div className="mb-8 mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 transition-transform group-hover:scale-110">
              <BookOpen className="h-12 w-12" />
            </div>
            
            <h2 className="text-3xl font-bold text-blue-950 dark:text-white mb-4">Rumah Qur'an</h2>
            <p className="text-blue-800/80 dark:text-slate-400 font-medium mb-8">
              Pendaftaran program Tahsin & Tahfidz untuk jenjang anak, remaja, dan dewasa.
            </p>
            
            <div className="inline-flex items-center gap-2 font-bold text-orange-600 dark:text-orange-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Menuju Formulir RQA <ArrowRight className="h-5 w-5" />
            </div>
          </Link>

          {/* Card SDQu */}
          <Link href="/pendaftaran/sd-quran" className="group relative overflow-hidden rounded-3xl bg-blue-50/50 dark:bg-white/5 border border-blue-100 dark:border-white/10 p-10 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 block text-center">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-blue-200 to-transparent dark:from-blue-600/20 rounded-bl-full opacity-50"></div>
            
            <div className="mb-8 mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-110">
              <GraduationCap className="h-12 w-12" />
            </div>
            
            <h2 className="text-3xl font-bold text-blue-950 dark:text-white mb-4">SD Qur'an</h2>
            <p className="text-blue-800/80 dark:text-slate-400 font-medium mb-8">
              Pendaftaran siswa baru tingkat Sekolah Dasar (Pendidikan Formal Integrasi).
            </p>
            
            <div className="inline-flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              Menuju Formulir SD <ArrowRight className="h-5 w-5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
