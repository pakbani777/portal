const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

const linkHtml = `                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Link Tugas (GForm, Wordwall, dll)</label>
                  <input type="url" value={formTugas.link_tugas} onChange={e => setFormTugas({...formTugas, link_tugas: e.target.value})} placeholder="https://docs.google.com/forms/..." className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm" required />
                </div>
                <div className="grid grid-cols-2 gap-4">`;

code = code.replace(
  '                </div>\n                <div className="grid grid-cols-2 gap-4">',
  linkHtml
);

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
