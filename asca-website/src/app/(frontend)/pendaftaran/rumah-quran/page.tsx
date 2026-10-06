import Link from "next/link";
import { ChevronRight, BookOpen, Send, Clock } from "lucide-react";
import prisma from "@/lib/prisma";
import RQAForm from "./RQAForm";

export const metadata = {
  title: "Pendaftaran Rumah Qur'an | Yayasan ASCA",
};

export default async function PendaftaranRQA() {
  const settingsDb = await prisma.siteSetting.findMany({
    where: { group: 'RQA' }
  });
  const getSetting = (key: string, def: string) => settingsDb.find(s => s.key === key)?.value || def;

  const isOpenStr = getSetting('RQA_REG_OPEN', "false");
  const isOpen = isOpenStr === "true";
  const regInfo = getSetting('RQA_REG_INFO', "Gelombang 1: 1 - 30 November 2026");

  return (
    <div className="pt-24 pb-24 bg-white dark:bg-[#0a0f1c] min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex items-center gap-2 text-sm font-bold text-orange-600 dark:text-orange-400 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/pendaftaran" className="hover:text-blue-600 transition-colors">Pendaftaran</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-blue-600 dark:text-blue-400">Rumah Qur'an</span>
        </div>

        <div className="bg-orange-50/50 dark:bg-white/5 border border-orange-100 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-xl shadow-orange-900/5 dark:shadow-none">
          <div className="flex items-center gap-4 mb-8 border-b border-orange-200 dark:border-white/10 pb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/30">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-blue-950 dark:text-white">Formulir Pendaftaran</h1>
              <p className="text-orange-600 dark:text-orange-400 font-bold">Rumah Qur'an Assurur (RQA)</p>
            </div>
          </div>

          {!isOpen ? (
            <div className="text-center py-12 px-4 bg-white dark:bg-[#0a0f1c] rounded-2xl border border-orange-200 dark:border-slate-800 shadow-sm">
              <div className="mx-auto h-20 w-20 bg-orange-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-blue-950 dark:text-white mb-2">Pendaftaran Belum Dibuka</h3>
              <p className="text-blue-800/80 dark:text-slate-400 max-w-md mx-auto font-medium mb-6">
                Mohon maaf, pendaftaran santri baru Rumah Qur'an Assurur saat ini sedang ditutup atau belum dimulai.
              </p>
              <div className="inline-block bg-orange-50 dark:bg-slate-800 border border-orange-200 dark:border-slate-700 rounded-xl p-4">
                <p className="text-sm font-bold text-blue-950 dark:text-white mb-1">Informasi Pendaftaran:</p>
                <p className="text-orange-600 dark:text-orange-400 font-bold">{regInfo}</p>
              </div>
            </div>
          ) : (
            <RQAForm programValue="Rumah Qur'an">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-blue-950 dark:text-slate-300">Nama Lengkap Santri *</label>
                  <input name="fullName" type="text" className="w-full bg-white dark:bg-[#0a0f1c] border border-orange-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" placeholder="Masukkan nama lengkap" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-blue-950 dark:text-slate-300">Jenis Kelamin *</label>
                  <select name="gender" className="w-full bg-white dark:bg-[#0a0f1c] border border-orange-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" required>
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-blue-950 dark:text-slate-300">Tempat Lahir *</label>
                  <input name="birthPlace" type="text" className="w-full bg-white dark:bg-[#0a0f1c] border border-orange-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-blue-950 dark:text-slate-300">Tanggal Lahir *</label>
                  <input name="birthDate" type="date" className="w-full bg-white dark:bg-[#0a0f1c] border border-orange-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-950 dark:text-slate-300">Alamat Domisili Lengkap *</label>
                <textarea name="address" rows={3} className="w-full bg-white dark:bg-[#0a0f1c] border border-orange-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" required></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-950 dark:text-slate-300">Nomor WhatsApp *</label>
                <input name="whatsapp" type="tel" className="w-full bg-white dark:bg-[#0a0f1c] border border-orange-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" placeholder="Contoh: 08123456789" required />
              </div>
            </RQAForm>
          )}
        </div>
      </div>
    </div>
  );
}
