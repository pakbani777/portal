const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

// 1. Init state
code = code.replace(
  "return localStorage.getItem('portal_admin_tab') || 'materi_nilai';",
  "let tab = localStorage.getItem('portal_admin_tab') || 'nilai';\n    if (tab === 'materi_nilai') tab = 'nilai';\n    return tab;"
);

// 2. Buttons
code = code.replace(
  `<button
              onClick={() => { sounds.playClick(); setActiveAdminTab('materi_nilai'); }}
              className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                activeAdminTab === 'materi_nilai'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }\`}
            >
              Materi & Nilai
            </button>`,
  `<button
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
            </button>`
);
// CRLF fallback
if (!code.includes("activeAdminTab('nilai')")) {
  const regexNav = /<button\s*onClick=\{\(\) => \{ sounds\.playClick\(\); setActiveAdminTab\('materi_nilai'\); \}\}[\s\S]*?Materi & Nilai\s*<\/button>/;
  code = code.replace(regexNav, `<button
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
            </button>`);
}

// 3. Tab contents
const regexTabStart = /\{activeAdminTab === 'materi_nilai' && \(\s*<div className="space-y-4">/;
code = code.replace(regexTabStart, `{activeAdminTab === 'materi' && (\n        <div className="space-y-4">`);

// 4. In `materi`, we keep everything EXCEPT we want to split right before Kolom Kanan
const splitRegex = /\{\/\* Kolom Kanan: Rekap Buku Nilai Siswa \*\/\}\s*<div className="lg:col-span-2 space-y-4">/;
code = code.replace(splitRegex, `</div>
          </div>
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
          <div className="space-y-4">`);

// 5. Remove grid wrappers
code = code.replace('<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">', '<div className="max-w-2xl mx-auto">');
code = code.replace('<div className="lg:col-span-1 space-y-4">', '<div className="space-y-4">');

// 6. Fix closing tags for `materi` since we removed 2 open tags in step 5, but we added a split that assumes we closed them.
// Wait! If I removed `<div className="grid ...">` and `<div className="lg:col-span-1 ...">` and replaced them with `<div className="max-w-2xl ...">` and `<div className="space-y-4">`, the NUMBER of open tags is exactly the SAME! (1 grid -> 1 max-w, 1 col-span -> 1 space-y).
// So the closing tags are PERFECTLY BALANCED!

// 7. Remove the filter buttons that were at the top of materi_nilai
const oldFilter = `{/* Filter Kelas */}
          <div className="flex items-center justify-end">
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {['7', '8', '9'].map((kls) => (
                <button
                  key={kls}
                  onClick={() => {
                    sounds.playClick();
                    setActiveKelas(kls);
                    setFormMateri(prev => ({ ...prev, kelas: kls }));
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
          </div>`;
// Just clear it from materi tab, as Materi doesn't really need a filter button (it has a dropdown inside the form anyway for "Kelas Tujuan"). Or we can keep it. Actually, `setFormMateri(prev => ({ ...prev, kelas: kls }))` is useful.
// I will just leave it there.

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
console.log('Done perfectly');
