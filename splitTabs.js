const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

// 1. Initial State
code = code.replace(
  "const [activeAdminTab, setActiveAdminTab] = useState(() => {\n    return localStorage.getItem('portal_admin_tab') || 'materi_nilai';\n  });",
  "const [activeAdminTab, setActiveAdminTab] = useState(() => {\n    let tab = localStorage.getItem('portal_admin_tab') || 'nilai';\n    if (tab === 'materi_nilai') tab = 'nilai';\n    return tab;\n  });"
);
// CRLF fallback
code = code.replace(
  "const [activeAdminTab, setActiveAdminTab] = useState(() => {\r\n    return localStorage.getItem('portal_admin_tab') || 'materi_nilai';\r\n  });",
  "const [activeAdminTab, setActiveAdminTab] = useState(() => {\r\n    let tab = localStorage.getItem('portal_admin_tab') || 'nilai';\r\n    if (tab === 'materi_nilai') tab = 'nilai';\r\n    return tab;\r\n  });"
);

// 2. Buttons
const buttonsTarget = `<button
              onClick={() => { sounds.playClick(); setActiveAdminTab('materi_nilai'); }}
              className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                activeAdminTab === 'materi_nilai'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }\`}
            >
              Materi & Nilai
            </button>`;

const newButtons = `<button
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
if (code.includes(buttonsTarget)) {
  code = code.replace(buttonsTarget, newButtons);
} else {
  code = code.replace(buttonsTarget.replace(/\n/g, '\r\n'), newButtons);
}

// 3. Render logic split
const renderTarget = `{activeAdminTab === 'materi_nilai' && (
        <div className="space-y-4">
          {/* Filter Kelas */}
          <div className="flex items-center justify-end">`;

const newRenderTarget = `{activeAdminTab === 'materi' && (
        <div className="space-y-4">
          {/* Filter Kelas */}
          <div className="flex items-center justify-end">`;

if (code.includes(renderTarget)) {
  code = code.replace(renderTarget, newRenderTarget);
} else {
  code = code.replace(renderTarget.replace(/\n/g, '\r\n'), newRenderTarget);
}

// The grid div wraps the materi form AND the rekap table.
// We need to split the grid.
const splitRegex = /<\/div>\s*<\/div>\s*\{\/\* Kolom Kanan: Rekap Buku Nilai Siswa \*\/\}/;
const newSplit = `</div>
          </div>
        </div>
      )}

      {activeAdminTab === 'nilai' && (
        <div className="space-y-4">
          {/* Filter Kelas */}
          <div className="flex items-center justify-end">
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
          
          {/* Rekap Buku Nilai Siswa (Full Width) */}`;

if (splitRegex.test(code)) {
  code = code.replace(splitRegex, newSplit);
} else {
  console.log('Split Regex failed');
}

// Now replace grid col-span classes to remove them since they are separated.
// The form: `<div className="lg:col-span-1 space-y-4">` => `<div className="max-w-2xl mx-auto space-y-4">`
code = code.replace('<div className="lg:col-span-1 space-y-4">', '<div className="max-w-2xl mx-auto space-y-4">');

// The table: `<div className="lg:col-span-2 space-y-4">` => `<div className="space-y-4">`
code = code.replace('<div className="lg:col-span-2 space-y-4">', '<div className="space-y-4">');

// And remove `<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">`
// Wait, if I remove it, the div matching must match.
// I can just replace `<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">` with `<div className="w-full">`
code = code.replace('<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">', '<div className="w-full">');

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
console.log('GuruAdminPage tabs split!');
