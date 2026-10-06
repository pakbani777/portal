import prisma from '@/lib/prisma';
import StatusSelect from '@/components/admin/StatusSelect';

export const metadata = {
  title: 'Data Pendaftar SDQu | Admin ASCA',
};

export default async function PendaftarSDQuPage() {
  const registrations = await prisma.registration.findMany({
    where: { institution: 'SDQu' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Data Pendaftar SD Qur'an (SDQu)</h1>
        <div className="flex items-center gap-4">
          <a href="/api/export/registrations?inst=SDQu" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm">
            Export Excel
          </a>
          <div className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-2 rounded-lg font-bold text-sm">
            Total: {registrations.length} Siswa
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a0f1c] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-bold">Tanggal Daftar</th>
                <th className="px-6 py-4 font-bold">Gelombang</th>
                <th className="px-6 py-4 font-bold">Nama Siswa</th>
                <th className="px-6 py-4 font-bold">L/P</th>
                <th className="px-6 py-4 font-bold">TTL</th>
                <th className="px-6 py-4 font-bold">Asal Sekolah</th>
                <th className="px-6 py-4 font-bold">Orang Tua</th>
                <th className="px-6 py-4 font-bold">WhatsApp</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-500">
                    Belum ada data pendaftar SDQu.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(reg.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {reg.program || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{reg.fullName}</div>
                      {reg.nisn && <div className="text-xs text-slate-500">NISN: {reg.nisn}</div>}
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {reg.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reg.birthPlace}, {new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(reg.birthDate)}
                    </td>
                    <td className="px-6 py-4">
                      {reg.prevSchool || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700 dark:text-slate-300">{reg.parentName}</div>
                      <div className="text-xs text-slate-500">{reg.parentJob}</div>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`https://wa.me/${reg.whatsapp.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline font-medium">
                        {reg.whatsapp}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <StatusSelect id={reg.id} currentStatus={reg.status} path="/admin/pendaftar-sdqu" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
