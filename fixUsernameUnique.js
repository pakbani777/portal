const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

code = code.replace(
  "const usersData = newUsers.map(u => ({",
  "const usersData = newUsers.map((u, i) => ({"
);

code = code.replace(
  "username: (u.nisn || (u.nama.replace(/\\s+/g, '').toLowerCase() + Math.floor(Math.random() * 10000))).substring(0, 50),",
  "username: (u.nisn || (u.nama.replace(/\\s+/g, '').toLowerCase() + Date.now().toString(36) + i)).substring(0, 50),"
);

fs.writeFileSync('server/index.js', code);
console.log('Fixed username logic in bulk users to use Date.now() + index');
