const fs = require('fs');
let code = fs.readFileSync('client/src/services/api.js', 'utf8');

code = code.replace(
  "export async function fetchUlanganList(kelas = 'all') {\n  const res = await fetch(`${BASE_URL}/ulangan?kelas=${kelas}`);",
  "export async function fetchUlanganList(kelas = 'all', namaSiswa = '') {\n  const res = await fetch(`${BASE_URL}/ulangan?kelas=${kelas}&nama_siswa=${encodeURIComponent(namaSiswa)}`);"
);

fs.writeFileSync('client/src/services/api.js', code);
