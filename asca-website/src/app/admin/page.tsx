import { Users, FileText, Activity, BookOpen, GraduationCap } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
  const stats = [
    { title: "Total Pendaftar RQA", value: await prisma.registration.count({ where: { institution: 'RQA' } }), icon: BookOpen, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
    { title: "Total Pendaftar SDQu", value: await prisma.registration.count({ where: { institution: 'SDQu' } }), icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { title: "Total Berita", value: await prisma.post.count(), icon: FileText, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
    { title: "Total Pengajar", value: await prisma.teacher.count(), icon: Users, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" }
  ];

  const recentRegistrations = await prisma.registration.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Selamat datang di Panel Admin Yayasan ASCA.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" /> Pendaftar Terbaru
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Pendaftar</th>
                <th className="px-6 py-4 font-medium">Lembaga</th>
                <th className="px-6 py-4 font-medium">No. WhatsApp</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Tanggal Masuk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Belum ada data pendaftar masuk.
                  </td>
                </tr>
              ) : (
                recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{reg.fullName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reg.institution === 'RQA' ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300'
                      }`}>
                        {reg.institution}
                      </span>
                    </td>
                    <td className="px-6 py-4">{reg.whatsapp}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reg.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        reg.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(reg.createdAt).toLocaleDateString('id-ID')}
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
