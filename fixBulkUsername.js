const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

code = code.replace(
  "username: (u.nisn || u.nama.replace(/\\s+/g, '').toLowerCase()).substring(0, 50),",
  "username: (u.nisn || (u.nama.replace(/\\s+/g, '').toLowerCase() + Math.floor(Math.random() * 10000))).substring(0, 50),"
);

fs.writeFileSync('server/index.js', code);
console.log('Backend bulk users updated.');
