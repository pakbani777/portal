const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

const targetLine = "Pengguna\n            </button>";
const insertIndex = code.indexOf(targetLine) + targetLine.length;

if (insertIndex > targetLine.length) {
  const newButtons = `
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
            
  code = code.substring(0, insertIndex) + newButtons + code.substring(insertIndex);
  fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
  console.log("Inserted!");
} else {
  console.log("Not found target line");
}
