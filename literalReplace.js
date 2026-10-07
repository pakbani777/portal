const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

const r1 = `const [activeAdminTab, setActiveAdminTab] = useState(() => {
    return localStorage.getItem('portal_admin_tab') || 'materi_nilai';
  });`;
const rep1 = `const [activeAdminTab, setActiveAdminTab] = useState(() => {
    let tab = localStorage.getItem('portal_admin_tab') || 'nilai';
    if (tab === 'materi_nilai') tab = 'nilai';
    return tab;
  });`;

const r2 = `          <button
            onClick={() => { sounds.playClick(); setActiveAdminTab('materi_nilai'); }}
            className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
              activeAdminTab === 'materi_nilai'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }\`}
          >
            Materi & Nilai
          </button>`;
const rep2 = `          <button
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

const r3 = `      {activeAdminTab === 'materi_nilai' && (
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Form Tambah Materi PAI Baru */}
        <div className="lg:col-span-1 space-y-4">`;

const rep3 = `      {activeAdminTab === 'materi' && (
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
        </div>

        <div className="max-w-3xl mx-auto space-y-4">`;

const r4 = `            </form>
          </div>
        </div>

        {/* Kolom Kanan: Rekap Buku Nilai Siswa */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">`;

const rep4 = `            </form>
          </div>
        </div>
      </div>
      )}

      {activeAdminTab === 'nilai' && (
      <div className="space-y-4">
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

        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">`;


const r5 = `                );
              })()}
            </div>

          </div>
        </div>

      </div>
      </div>
      )}
      {activeAdminTab === 'users' && <UserManagement />}`;

const rep5 = `                );
              })()}
            </div>

          </div>
        </div>

      </div>
      )}
      {activeAdminTab === 'users' && <UserManagement />}`;

// Normalize CRLF to LF for reliable splitting
let safeCode = code.replace(/\\r\\n/g, '\\n');
const safeReplace = (target, replacement, step) => {
  if (safeCode.includes(target)) {
    safeCode = safeCode.split(target).join(replacement);
    console.log(\`Replaced \${step} successfully\`);
  } else {
    console.log(\`FAILED TO REPLACE \${step}\`);
  }
}

safeReplace(r1, rep1, 'init');
safeReplace(r2, rep2, 'buttons');
safeReplace(r3, rep3, 'materi_wrapper');
safeReplace(r4, rep4, 'split_nilai');
safeReplace(r5, rep5, 'close_tags');

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', safeCode);
