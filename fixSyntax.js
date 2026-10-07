const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

code = code.replace(
  "res.json({ success: true, message: Berhasil menginput \\ siswa kelas \\ });",
  "res.json({ success: true, message: `Berhasil menginput ${siswaData.length} siswa kelas ${kelasTarget}` });"
);

fs.writeFileSync('server/index.js', code);
