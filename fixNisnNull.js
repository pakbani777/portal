const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

code = code.replace(
  "nisn_nip: u.nisn || '',",
  "nisn_nip: u.nisn ? u.nisn : null,"
);

code = code.replace(
  "nisn: u.nisn || '',",
  "nisn: u.nisn ? u.nisn : null,"
);

fs.writeFileSync('server/index.js', code);
console.log('Fixed nisn_nip to use null instead of empty string');
