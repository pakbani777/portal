const fs = require('fs');
const code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');
const lines = code.split(/\r?\n/);

// We will build a new array of lines
const newLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.includes("return localStorage.getItem('portal_admin_tab') || 'materi_nilai';")) {
    newLines.push("    let tab = localStorage.getItem('portal_admin_tab') || 'nilai';");
    newLines.push("    if (tab === 'materi_nilai') tab = 'nilai';");
    newLines.push("    return tab;");
    continue;
  }

  if (line.includes("setActiveAdminTab('materi_nilai')")) {
    // replace button
    newLines.push(`          <button
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
    // skip the rest of the button lines (i + 1 to i + 8)
    i += 8;
    continue;
  }

  if (line.includes("activeAdminTab === 'materi_nilai'")) {
    newLines.push(line.replace("materi_nilai", "materi"));
    continue;
  }

  // Hide the filter from materi tab by removing it, we'll inject it into nilai tab.
  // Actually, we can keep the filter in materi tab, it's fine.
  
  // Remove the grid wrappers
  if (line.includes('<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">')) {
    newLines.push('        <div className="max-w-2xl mx-auto space-y-4">');
    continue;
  }
  
  if (line.includes('<div className="lg:col-span-1 space-y-4">')) {
    continue; // completely remove this div
  }

  // Around line 525, close the materi tab and start the nilai tab
  if (line.includes("{/* Kolom Kanan: Rekap Buku Nilai Siswa */}")) {
    // We just finished the left column (form).
    // The previous line was `</div>` that closed `lg:col-span-1` which we skipped. So we must NOT include that closing div!
    // Wait, let's pop the last `</div>` which belonged to `lg:col-span-1`.
    newLines.pop(); // remove the </div> for col-span-1
    newLines.push("        </div>"); // close max-w-2xl
    newLines.push("      </div>"); // close space-y-4 outer
    newLines.push("      )}"); // close activeAdminTab === 'materi'
    newLines.push("");
    newLines.push("      {activeAdminTab === 'nilai' && (");
    newLines.push("      <div className=\"space-y-4\">");
    
    // Inject the class filter here
    newLines.push(`        <div className="flex items-center justify-end">
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
        </div>`);
        
    // Now skip the `lg:col-span-2` wrapper and just push the comment
    newLines.push("        {/* Rekap Buku Nilai Siswa */}");
    i += 1; // skip `<div className="lg:col-span-2 space-y-4">`
    continue;
  }

  // Around line 630, we reach the end of the original grid
  // The original has:
  // 630:           </div>
  // 631:         </div> // closes lg:col-span-2
  // 632: 
  // 633:       </div> // closes grid
  // 634:       </div> // closes space-y-4
  // 635:       )}
  
  // Since we skipped `lg:col-span-2` and `grid`, we only need to close `space-y-4` and `)}`.
  // I will intercept line 633 `      </div> // grid` and skip it, and line 631 `        </div> // col-span-2`
  if (i === 630 && line.includes('        </div>') && lines[i+2].includes('</div>')) {
    // This is the end block. I will just rely on the line index because it's exact!
    // But wait, line index might be shifted. 
  }
  
  newLines.push(line);
}

// Let's manually fix the closing tags at the end of the `nilai` block using string replace on the final output to be perfectly sure.
let result = newLines.join('\\n');

const endOfNilaiRegex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*\{activeAdminTab === 'users'/;
const newEndOfNilai = `</div>\n      </div>\n      )}\n      {activeAdminTab === 'users'`;
result = result.replace(endOfNilaiRegex, newEndOfNilai);

// Also remove the extra closing div left by popping if we missed something. 
// Just format it nicely.
fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', result);
console.log('Done!');
