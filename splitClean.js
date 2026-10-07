const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

// 1. Initial State
code = code.replace(
  "const [activeAdminTab, setActiveAdminTab] = useState(() => {\\n    return localStorage.getItem('portal_admin_tab') || 'materi_nilai';\\n  });",
  "const [activeAdminTab, setActiveAdminTab] = useState(() => {\\n    let tab = localStorage.getItem('portal_admin_tab') || 'nilai';\\n    if (tab === 'materi_nilai') tab = 'nilai';\\n    return tab;\\n  });"
);
// Try regex because of CRLF
const regexInit = /const \[activeAdminTab, setActiveAdminTab\] = useState\(\(\) => \{\s*return localStorage\.getItem\('portal_admin_tab'\) \|\| 'materi_nilai';\s*\}\);/;
code = code.replace(regexInit, `const [activeAdminTab, setActiveAdminTab] = useState(() => {
    let tab = localStorage.getItem('portal_admin_tab') || 'nilai';
    if (tab === 'materi_nilai') tab = 'nilai';
    return tab;
  });`);

// 2. Navigation buttons
const navRegex = /<button\s*onClick=\{\(\) => \{ sounds\.playClick\(\); setActiveAdminTab\('materi_nilai'\); \}\}\s*className=\{`[^`]+`\}\s*>\s*Materi & Nilai\s*<\/button>/;
const newNav = `<button
              onClick={() => { sounds.playClick(); setActiveAdminTab('nilai'); }}
              className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                activeAdminTab === 'nilai'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }\`}
            >
              Buku Nilai
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveAdminTab('materi'); }}
              className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                activeAdminTab === 'materi'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }\`}
            >
              Buat Materi
            </button>`;
code = code.replace(navRegex, newNav);

// 3. Tab contents
// I will just use string replacement on `{activeAdminTab === 'materi_nilai' && (`
code = code.replace(/{activeAdminTab === 'materi_nilai' && \(/, `{activeAdminTab === 'materi' && (`);

// Find the start of the right column: `{/* Kolom Kanan: Rekap Buku Nilai Siswa */}`
// and close the previous tab content, then open `{activeAdminTab === 'nilai' && (`
const splitRegex = /\{\/\* Kolom Kanan: Rekap Buku Nilai Siswa \*\/\}\s*<div className="lg:col-span-2 space-y-4">/;
const newSplit = `
        </div>
      )}

      {activeAdminTab === 'nilai' && (
        <div className="space-y-4">
          <div className="flex items-center justify-end mb-4">
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {['7', '8', '9'].map((kls) => (
                <button
                  key={kls}
                  onClick={() => {
                    sounds.playClick();
                    setActiveKelas(kls);
                  }}
                  className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                    activeKelas === kls
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }\`}
                >
                  Kelas {kls}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">`;

code = code.replace(splitRegex, newSplit);

// 4. Remove grid classes
code = code.replace(/<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">/, `<div className="w-full max-w-3xl mx-auto">`);
code = code.replace(/<div className="lg:col-span-1 space-y-4">/, `<div className="space-y-4">`);

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
console.log('Split completed');
