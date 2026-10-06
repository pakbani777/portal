const fs = require('fs');
let c = fs.readFileSync('client/src/components/Navbar.jsx', 'utf8');

c = c.replace(/<span className="text-\[10px\] uppercase font-bold tracking-wider px-2 py-0\.5 rounded-full bg-blue-100 text-blue-800">\s*PAI SMP\s*<\/span>/, '');

const selectRegex = /<select[\s\S]*?<\/select>/;
const selectCode = `<select value={activeKelas} onChange={handleKelasChange} className="bg-transparent text-xs font-bold text-slate-800 py-1.5 px-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="7">Kelas 7</option><option value="8">Kelas 8</option><option value="9">Kelas 9</option></select>`;

c = c.replace(selectRegex, `{currentUser?.role === 'siswa' ? <span className="bg-transparent text-xs font-bold text-slate-800 py-1.5 px-2">Kelas {activeKelas}</span> : ${selectCode}}`);

fs.writeFileSync('client/src/components/Navbar.jsx', c);
