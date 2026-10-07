const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

const targetRegex = /<button[\s\S]*?setActiveAdminTab\('users'\)[\s\S]*?Pengguna\n\s*<\/button>/;

const newButtons = `<button
            onClick={() => { sounds.playClick(); setActiveAdminTab('users'); }}
            className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
              activeAdminTab === 'users'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }\`}
          >
            Pengguna
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveAdminTab('tugas'); }}
            className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
              activeAdminTab === 'tugas'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }\`}
          >
            Kelola Tugas
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveAdminTab('ulangan'); }}
            className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
              activeAdminTab === 'ulangan'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }\`}
          >
            Buat CBT
          </button>`;

if (targetRegex.test(code)) {
  code = code.replace(targetRegex, newButtons);
  fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
  console.log("Tab buttons added to GuruAdminPage.jsx");
} else {
  console.log("Could not find Pengguna button to replace");
}
