const fs = require('fs');
let code = fs.readFileSync('client/src/pages/UlanganPage.jsx', 'utf8');

code = code.replace(
  "fetchUlanganList(activeKelas)",
  "fetchUlanganList(activeKelas, currentUser?.nama)"
);

fs.writeFileSync('client/src/pages/UlanganPage.jsx', code);
