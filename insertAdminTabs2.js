const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

const targetLine1 = "Pengguna\n            </button>";
const targetLine2 = "Pengguna\r\n            </button>";
let insertIndex = code.indexOf(targetLine1);
let len = targetLine1.length;

if (insertIndex === -1) {
  insertIndex = code.indexOf(targetLine2);
  len = targetLine2.length;
}

if (insertIndex !== -1) {
  insertIndex += len;
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
