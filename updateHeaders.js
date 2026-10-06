const fs = require('fs');
const files = [
  'client/src/pages/MateriPage.jsx',
  'client/src/pages/JadwalPage.jsx',
  'client/src/pages/KuisPage.jsx',
  'client/src/pages/UlanganPage.jsx'
];

files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/>Kelas 7, 8, 9<\/span>/g, ">{currentUser?.role === 'siswa' ? `Kelas ${activeKelas}` : 'Kelas 7, 8, 9'}</span>");
  fs.writeFileSync(file, c);
});
