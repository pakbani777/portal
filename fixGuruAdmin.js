const fs = require('fs');
let c = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

const importApi = `import { fetchNilai, createMateri, createPengumuman } from '../services/api';`;
c = c.replace(/import { fetchNilai, createMateri } from '\.\.\/services\/api';/, importApi);

const pengumumanState = `
  const [formPengumuman, setFormPengumuman] = useState({ judul: '', isi: '', tipe: 'info' });
  const [submittingPengumuman, setSubmittingPengumuman] = useState(false);
  const handlePengumumanSubmit = async (e) => {
    e.preventDefault();
    if (!formPengumuman.judul || !formPengumuman.isi) return showToast('Judul dan Isi harus diisi');
    setSubmittingPengumuman(true);
    try {
      const res = await createPengumuman(formPengumuman);
      if (res.success) {
        showToast('Pengumuman berhasil diterbitkan!');
        setFormPengumuman({ judul: '', isi: '', tipe: 'info' });
      } else {
        showToast(res.message);
      }
    } catch (e) {
      showToast('Gagal menerbitkan pengumuman');
    }
    setSubmittingPengumuman(false);
  };
`;

c = c.replace(/const \[activeAdminTab, setActiveAdminTab\] = useState\('materi_nilai'\);/, `const [activeAdminTab, setActiveAdminTab] = useState('materi_nilai');\n` + pengumumanState);

const renderPengumuman = `
        {activeAdminTab === 'pengumuman' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
              📝 Buat Pengumuman Baru
            </h2>
            <form onSubmit={handlePengumumanSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Judul Pengumuman</label>
                <input type="text" value={formPengumuman.judul} onChange={e => setFormPengumuman({...formPengumuman, judul: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tipe (info/peringatan/sukses)</label>
                <select value={formPengumuman.tipe} onChange={e => setFormPengumuman({...formPengumuman, tipe: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                  <option value="info">Info</option>
                  <option value="peringatan">Peringatan</option>
                  <option value="sukses">Sukses</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Isi Pengumuman</label>
                <textarea rows="4" value={formPengumuman.isi} onChange={e => setFormPengumuman({...formPengumuman, isi: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm" required />
              </div>
              <button type="submit" disabled={submittingPengumuman} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl cursor-pointer">
                {submittingPengumuman ? 'Menerbitkan...' : 'Terbitkan Pengumuman'}
              </button>
            </form>
          </div>
        )}
`;

c = c.replace(/} \): \(\s*<UserManagement \/>\s*\)}/, `}
        {activeAdminTab === 'users' && <UserManagement />}
        ${renderPengumuman}
      `);

c = c.replace(/{activeAdminTab === 'materi_nilai' \? \(/, `{activeAdminTab === 'materi_nilai' && (`);

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', c);
