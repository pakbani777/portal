const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

// 1. Initial State
code = code.replace(
  "return localStorage.getItem('portal_admin_tab') || 'materi_nilai';",
  "let tab = localStorage.getItem('portal_admin_tab') || 'nilai';\n    if (tab === 'materi_nilai') tab = 'nilai';\n    return tab;"
);

// 2. Buttons
const navTarget = `<button
              onClick={() => { sounds.playClick(); setActiveAdminTab('materi_nilai'); }}
              className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                activeAdminTab === 'materi_nilai'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }\`}
            >
              Materi & Nilai
            </button>`;
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
code = code.replace(navTarget.replace(/\n/g, '\r\n'), newNav);
code = code.replace(navTarget, newNav);

// 3. The main wrapper for materi
const renderTarget = `{activeAdminTab === 'materi_nilai' && (
        <div className="space-y-4">
          {/* Filter Kelas */}
          <div className="flex items-center justify-end">`;
const newRender = `{activeAdminTab === 'materi' && (
        <div className="w-full max-w-3xl mx-auto space-y-4">
          {/* Filter Kelas */}
          <div className="flex items-center justify-end">`;
code = code.replace(renderTarget.replace(/\n/g, '\r\n'), newRender);
code = code.replace(renderTarget, newRender);

// 4. Remove the grid wrapper for materi
code = code.replace('<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">', '');
code = code.replace('<div className="lg:col-span-1 space-y-4">', '');

// 5. Replace the right column with the end of materi tab and start of nilai tab
const splitTarget = `{/* Kolom Kanan: Rekap Buku Nilai Siswa */}
          <div className="lg:col-span-2 space-y-4">`;
const splitNew = `</div>
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
          </div>`;
code = code.replace(splitTarget.replace(/\n/g, '\r\n'), splitNew);
code = code.replace(splitTarget, splitNew);

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
console.log('Fixed tabs properly');
