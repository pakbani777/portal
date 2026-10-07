const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

const splitRegex = /\{\/\* Kolom Kanan: Rekap Buku Nilai Siswa \*\/\}\s*<div className="lg:col-span-2 space-y-4">/;
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

if (splitRegex.test(code)) {
  code = code.replace(splitRegex, splitNew);
  
  // also fix the missing </div> from the two removed divs (grid and col-span-1)
  // because we removed 2 opening divs, we need to remove 2 closing divs at the end of the `materi` block!
  // Wait, I just replaced the entire start of the `nilai` block which acts as a separator.
  // The end of `materi` block was the start of `nilai` block.
  // But wait! If I removed two opening divs (`grid grid-cols-1` and `lg:col-span-1`), then the `materi` form doesn't need those closing divs anymore!
  // Let's just restore the file again and do it with AST or precisely.
}
