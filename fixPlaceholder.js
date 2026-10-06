const fs = require('fs');
let c = fs.readFileSync('client/src/components/UserManagement.jsx', 'utf8');

c = c.replace(
  'Paste Data Siswa (Format: NISN [TAB/KOMA] Nama Lengkap)',
  'Paste Data Siswa (Cukup Daftar Nama Lengkap)'
);

c = c.replace(
  'placeholder="0012345678  Ahmad Fauzi\\n0087654321  Budi Santoso\\nAtau cukup copy 2 kolom (NISN dan Nama) dari Ms Excel lalu paste di sini."',
  'placeholder="Ahmad Fauzi\\nBudi Santoso\\nSiti Aminah\\n\\n(Cukup copy 1 kolom berisi daftar nama dari Excel lalu paste di sini)"'
);

fs.writeFileSync('client/src/components/UserManagement.jsx', c);
