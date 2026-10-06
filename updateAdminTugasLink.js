const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

code = code.replace(
  "const [formTugas, setFormTugas] = useState({ judul: '', deskripsi: '', deadline: '', kelas: activeKelas });",
  "const [formTugas, setFormTugas] = useState({ judul: '', deskripsi: '', deadline: '', kelas: activeKelas, link_tugas: '' });"
);

code = code.replace(
  "if (!formTugas.judul || !formTugas.deskripsi || !formTugas.deadline) return showToast('Semua kolom tugas harus diisi');",
  "if (!formTugas.judul || !formTugas.deskripsi || !formTugas.deadline || !formTugas.link_tugas) return showToast('Semua kolom tugas harus diisi termasuk link tugas');"
);

code = code.replace(
  "setFormTugas({ judul: '', deskripsi: '', deadline: '', kelas: activeKelas });",
  "setFormTugas({ judul: '', deskripsi: '', deadline: '', kelas: activeKelas, link_tugas: '' });"
);

const linkTugasHtml = `
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Link Tugas (GForm, Wordwall, dll)</label>
                <input type="url" value={formTugas.link_tugas} onChange={e => setFormTugas({...formTugas, link_tugas: e.target.value})} placeholder="https://docs.google.com/forms/..." className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm" required />
              </div>
`;

code = code.replace(
  '                <div className="grid grid-cols-2 gap-4">',
  linkTugasHtml + '                <div className="grid grid-cols-2 gap-4">'
);

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
