const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

// Import fetchUlanganList
code = code.replace(
  "import { fetchNilai, createMateri, createPengumuman, createTugas, createUlangan } from '../services/api';",
  "import { fetchNilai, createMateri, createPengumuman, createTugas, createUlangan, fetchUlanganList } from '../services/api';"
);

// Add state
const hookLoc = "const [nilaiList, setNilaiList] = useState([]);";
code = code.replace(hookLoc, hookLoc + "\n  const [ulanganList, setUlanganList] = useState([]);");

// Add fetch in loadNilai (or a separate useEffect)
const loadNilaiBlock = `  const loadNilai = () => {
    setLoading(true);
    fetchNilai('', activeKelas)
      .then((res) => {
        if (res.success) setNilaiList(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };`;

const newLoadNilaiBlock = `  const loadNilai = () => {
    setLoading(true);
    fetchNilai('', activeKelas)
      .then((res) => {
        if (res.success) setNilaiList(res.data);
      })
      .catch((err) => console.error(err));
      
    fetchUlanganList(activeKelas)
      .then((res) => {
        if (res.success) setUlanganList(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };`;

code = code.replace(loadNilaiBlock, newLoadNilaiBlock);

// Render UI for CBT results
const ulanganFormEnd = `              </form>
            </div>
          )}`;

const newUlanganFormEnd = `              </form>
            </div>

            {/* DAFTAR CBT & HASIL NILAI */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in mt-6">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
                Daftar Ulangan CBT & Hasil Nilai (Kelas {activeKelas})
              </h2>
              {ulanganList.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">Belum ada ujian CBT untuk kelas ini.</div>
              ) : (
                <div className="space-y-6">
                  {ulanganList.map(u => {
                    const ulanganNilai = nilaiList.filter(n => n.tipe === 'ulangan' && n.ref_id === u.id);
                    return (
                      <div key={u.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h3 className="font-bold text-slate-800 text-sm">{u.judul}</h3>
                            <p className="text-xs text-slate-500">Token: <span className="font-mono font-bold text-blue-700">{u.token_ujian}</span> | Durasi: {u.durasi_menit} menit</p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-full">
                            {ulanganNilai.length} Siswa Mengerjakan
                          </span>
                        </div>
                        
                        {ulanganNilai.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs bg-white border border-slate-100 rounded-lg overflow-hidden">
                              <thead className="bg-slate-100 text-slate-500">
                                <tr>
                                  <th className="py-2 px-3">Nama Siswa</th>
                                  <th className="py-2 px-3 text-center">Benar</th>
                                  <th className="py-2 px-3 text-center">Total Soal</th>
                                  <th className="py-2 px-3 text-center">Skor (0-100)</th>
                                  <th className="py-2 px-3 text-right">Waktu Selesai</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {ulanganNilai.map(n => (
                                  <tr key={n.id} className="hover:bg-slate-50/50">
                                    <td className="py-2 px-3 font-semibold text-slate-700">{n.nama_siswa}</td>
                                    <td className="py-2 px-3 text-center">{n.jawaban_benar}</td>
                                    <td className="py-2 px-3 text-center">{n.total_soal}</td>
                                    <td className="py-2 px-3 text-center font-bold text-blue-700">{n.skor}</td>
                                    <td className="py-2 px-3 text-right text-[10px] text-slate-400">{n.waktu_selesai}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">Belum ada siswa yang mengerjakan CBT ini.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}`;

code = code.replace(ulanganFormEnd, newUlanganFormEnd);

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
console.log('Added CBT results to GuruAdminPage');
