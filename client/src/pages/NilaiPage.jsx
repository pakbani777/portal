import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchNilai } from '../services/api';
import { Award, Clock, FileSpreadsheet } from 'lucide-react';

export default function NilaiPage() {
  const { currentUser, activeKelas } = useApp();
  const [nilaiList, setNilaiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (currentUser?.nama) {
      setLoading(true);
      fetchNilai(currentUser.nama, activeKelas)
        .then((res) => {
          if (isMounted && res.success) {
            setNilaiList(res.data);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, [currentUser, activeKelas]);

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            Buku Nilai & Prestasi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Rekapitulasi hasil asesmen dan kuis interaktif PAI Kelas {activeKelas}.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Riwayat Nilai Kamu</h2>
            <p className="text-[11px] text-slate-400">Terus tingkatkan belajarmu, {currentUser?.nama}!</p>
          </div>
          <div className="bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-100">
            {nilaiList.length} Tugas/Ujian
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Tipe Asesmen</th>
                <th className="py-3 px-4 text-center">Skor Akhir</th>
                <th className="py-3 px-4 text-center">Detail (Benar/Total)</th>
                <th className="py-3 px-4 text-right">Waktu Penyelesaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Memuat data nilai...
                  </td>
                </tr>
              ) : nilaiList.length > 0 ? (
                nilaiList.map((n) => {
                  const tuntas = n.skor >= 75;
                  return (
                    <tr key={n.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg \${n.tipe === 'ulangan' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {n.tipe === 'ulangan' ? <FileSpreadsheet className="w-3.5 h-3.5" /> : <Award className="w-3.5 h-3.5" />}
                          </div>
                          <span className="font-bold text-slate-700 capitalize">{n.tipe === 'ulangan' ? 'Ulangan CBT' : n.tipe}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full font-bold text-[11px] \${tuntas ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                          {n.skor}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-slate-500">
                        {n.jawaban_benar} / {n.total_soal}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 font-medium">
                        <span className="flex items-center justify-end gap-1">
                          <Clock className="w-3.5 h-3.5" /> {n.waktu_selesai}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                    Kamu belum pernah mengerjakan ujian atau kuis apapun.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
