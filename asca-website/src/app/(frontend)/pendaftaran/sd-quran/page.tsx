import Link from "next/link";
import { ChevronRight, GraduationCap, Send, Clock, CheckCircle2, CalendarDays, Wallet } from "lucide-react";
import prisma from "@/lib/prisma";
import SDQuForm from "./SDQuForm";

export const metadata = {
  title: "Pendaftaran SD Qur'an | Yayasan ASCA",
};

export default async function PendaftaranSDQu() {
  const settingsDb = await prisma.siteSetting.findMany({
    where: { group: 'SDQu' }
  });
  const getSetting = (key: string, def: string) => settingsDb.find(s => s.key === key)?.value || def;

  const isOpenStr = getSetting('SDQu_REG_OPEN', "false");
  const isGlobalOpen = isOpenStr === "true";

  const waves = [1, 2, 3].map(g => ({
    id: g,
    open: getSetting(`SDQu_G${g}_OPEN`, "false") === "true",
    waktu: getSetting(`SDQu_G${g}_WAKTU`, g === 1 ? "1 Sep - 31 Okt" : g === 2 ? "1 Nov - 31 Des" : "1 Jan - Kuota Habis"),
    brosur: getSetting(`SDQu_G${g}_BROSUR`, "")
  }));

  const isAnyWaveOpen = waves.some(w => w.open) || isGlobalOpen;

  return (
    <div className="pt-24 pb-24 bg-white dark:bg-[#0a0f1c] min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 mb-8">
          <Link href="/" className="hover:text-orange-500 transition-colors">Beranda</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/pendaftaran" className="hover:text-orange-500 transition-colors">Pendaftaran</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-orange-600 dark:text-orange-400">SD Qur'an</span>
        </div>

        <div className="bg-blue-50/50 dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-xl shadow-blue-900/5 dark:shadow-none">
          <div className="flex items-center gap-4 mb-8 border-b border-blue-200 dark:border-white/10 pb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-blue-950 dark:text-white">Formulir PPDB Baru</h1>
              <p className="text-blue-600 dark:text-blue-400 font-bold">SD Qur'an Assurur (SDQu)</p>
            </div>
          </div>

          <div className="mb-10 space-y-8">
            {/* JADWAL PENDAFTARAN */}
            <div className="bg-white dark:bg-[#0a0f1c] rounded-2xl p-6 border border-blue-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold text-blue-950 dark:text-white mb-6 border-b border-blue-50 dark:border-slate-800 pb-3">Jadwal Pendaftaran</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {waves.map((wave) => (
                  <div key={wave.id} className="border border-blue-200 dark:border-slate-700 rounded-xl p-5 bg-blue-50/30 dark:bg-slate-800/50 hover:border-blue-400 transition-colors flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                        <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="font-bold text-blue-950 dark:text-white">Gelombang {wave.id}</h4>
                      {!wave.open && (
                        <span className="ml-auto text-[10px] font-bold bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded-md uppercase">Tutup</span>
                      )}
                      {wave.open && (
                        <span className="ml-auto text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 px-2 py-1 rounded-md uppercase">Buka</span>
                      )}
                    </div>
                    <div className="space-y-3 mt-4 flex-grow">
                      <div>
                        <p className="text-xs text-blue-800/60 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Waktu Pembukaan</p>
                        <p className="text-sm font-medium text-blue-950 dark:text-slate-200">{wave.waktu}</p>
                      </div>
                    </div>
                    
                    {wave.brosur && wave.brosur.trim() !== '' && (
                      <div className="mt-4 pt-4 border-t border-blue-100 dark:border-slate-700">
                        <a href={wave.brosur} target="_blank" rel="noopener noreferrer" className="w-full inline-block text-center text-xs font-bold bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-600 text-blue-700 dark:text-blue-400 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                          Download Syarat & Biaya
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!isAnyWaveOpen ? (
            <div className="text-center py-12 px-4 bg-white dark:bg-[#0a0f1c] rounded-2xl border border-blue-200 dark:border-slate-800 shadow-sm">
              <div className="mx-auto h-20 w-20 bg-blue-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-950 dark:text-white mb-2">PPDB Belum Dibuka</h3>
              <p className="text-blue-800/80 dark:text-slate-400 max-w-md mx-auto font-medium mb-6">
                Mohon maaf, Penerimaan Peserta Didik Baru (PPDB) SD Qur'an Assurur saat ini sedang ditutup atau belum dimulai.
              </p>
            </div>
          ) : (

          <SDQuForm programValue={waves.find(w => w.open)?.id ? `Gelombang ${waves.find(w => w.open)?.id}` : 'Gelombang Umum'}>
            <h3 className="text-lg font-bold text-blue-950 dark:text-white border-b-2 border-blue-100 dark:border-slate-800 pb-2 inline-block">A. Data Calon Siswa</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-950 dark:text-slate-300">Nama Lengkap Siswa *</label>
                <input name="fullName" type="text" className="w-full bg-white dark:bg-[#0a0f1c] border border-blue-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Sesuai Akte Kelahiran" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-950 dark:text-slate-300">NISN (Jika Ada)</label>
                <input name="nisn" type="text" className="w-full bg-white dark:bg-[#0a0f1c] border border-blue-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Nomor Induk Siswa Nasional" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-950 dark:text-slate-300">Tempat & Tanggal Lahir *</label>
                <div className="flex gap-2">
                  <input name="birthPlace" type="text" className="w-1/2 bg-white dark:bg-[#0a0f1c] border border-blue-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Tempat" required />
                  <input name="birthDate" type="date" className="w-1/2 bg-white dark:bg-[#0a0f1c] border border-blue-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-950 dark:text-slate-300">Jenis Kelamin *</label>
                <select name="gender" className="w-full bg-white dark:bg-[#0a0f1c] border border-blue-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required>
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-blue-950 dark:text-slate-300">Asal Sekolah (TK/PAUD) *</label>
              <input name="prevSchool" type="text" className="w-full bg-white dark:bg-[#0a0f1c] border border-blue-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Nama TK atau PAUD sebelumnya" required />
            </div>

            <h3 className="text-lg font-bold text-blue-950 dark:text-white border-b-2 border-blue-100 dark:border-slate-800 pb-2 inline-block pt-6">B. Data Orang Tua / Wali</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-950 dark:text-slate-300">Nama Ayah / Wali *</label>
                <input name="parentName" type="text" className="w-full bg-white dark:bg-[#0a0f1c] border border-blue-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-950 dark:text-slate-300">Pekerjaan Ayah / Wali *</label>
                <input name="parentJob" type="text" className="w-full bg-white dark:bg-[#0a0f1c] border border-blue-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-950 dark:text-slate-300">Nomor WhatsApp Aktif *</label>
                <input name="whatsapp" type="tel" className="w-full bg-white dark:bg-[#0a0f1c] border border-blue-200 dark:border-slate-700 rounded-xl px-4 py-3 text-blue-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Akan digunakan untuk info seleksi" required />
              </div>
            </div>
          </SDQuForm>
          )}
        </div>
      </div>
    </div>
  );
}
