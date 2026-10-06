const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

const importApi = `import { fetchNilai, createMateri, createPengumuman, createTugas } from '../services/api';`;
code = code.replace(/import { fetchNilai, createMateri, createPengumuman } from '\.\.\/services\/api';/, importApi);

const tugasState = `
  const [formTugas, setFormTugas] = useState({ judul: '', deskripsi: '', deadline: '', kelas: activeKelas });
  const [submittingTugas, setSubmittingTugas] = useState(false);
  
  const handleTugasSubmit = async (e) => {
    e.preventDefault();
    if (!formTugas.judul || !formTugas.deskripsi || !formTugas.deadline) return showToast('Semua kolom tugas harus diisi');
    setSubmittingTugas(true);
    try {
      const res = await createTugas({ ...formTugas, kelas: activeKelas });
      if (res.success) {
        showToast('Tugas berhasil dibuat!');
        setFormTugas({ judul: '', deskripsi: '', deadline: '', kelas: activeKelas });
      } else {
        showToast(res.message);
      }
    } catch (e) {
      showToast('Gagal membuat tugas');
    }
    setSubmittingTugas(false);
  };
`;

code = code.replace(/const \[activeAdminTab, setActiveAdminTab\] = useState\('materi_nilai'\);/, `const [activeAdminTab, setActiveAdminTab] = useState('materi_nilai');\n` + tugasState);

const tugasTabButton = `
            <button
              onClick={() => { sounds.playClick(); setActiveAdminTab('tugas'); }}
              className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                activeAdminTab === 'tugas'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }\`}
            >
              Kelola Tugas
            </button>
`;

code = code.replace(/Kelola Tugas\s*<\/button>/g, ''); // in case it was there
code = code.replace(/Pengumuman\s*<\/button>/, `Pengumuman\n            </button>\n${tugasTabButton}`);

const renderTugas = `
        {activeAdminTab === 'tugas' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
              📝 Buat Tugas Baru
            </h2>
            <form onSubmit={handleTugasSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Judul Tugas</label>
                <input type="text" value={formTugas.judul} onChange={e => setFormTugas({...formTugas, judul: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Batas Waktu (Deadline)</label>
                  <input type="datetime-local" value={formTugas.deadline} onChange={e => setFormTugas({...formTugas, deadline: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Target Kelas</label>
                  <input type="text" value={activeKelas} disabled className="w-full px-4 py-2 rounded-xl bg-slate-200 border border-slate-300 text-sm opacity-70" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi / Instruksi Tugas</label>
                <textarea rows="4" value={formTugas.deskripsi} onChange={e => setFormTugas({...formTugas, deskripsi: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm" required />
              </div>
              <button type="submit" disabled={submittingTugas} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl cursor-pointer">
                {submittingTugas ? 'Membuat...' : 'Terbitkan Tugas'}
              </button>
            </form>
          </div>
        )}
`;

code = code.replace(/{\/\* Add User Form \*\//, ''); // Clean up if needed
code = code.replace(/<UserManagement \/>\s*}/, `<UserManagement />}\n${renderTugas}`);

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
