const fs = require('fs');

// Fix TugasPage.jsx
let tugasCode = fs.readFileSync('client/src/pages/TugasPage.jsx', 'utf8');
tugasCode = tugasCode.replace(
  "new Date(tugas.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })",
  "tugas.deadline ? new Date(tugas.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'"
);
fs.writeFileSync('client/src/pages/TugasPage.jsx', tugasCode);

// Fix Dashboard.jsx
let dashCode = fs.readFileSync('client/src/pages/Dashboard.jsx', 'utf8');
dashCode = dashCode.replace(
  "new Date(j.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })",
  "j.deadline ? new Date(j.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'"
);
fs.writeFileSync('client/src/pages/Dashboard.jsx', dashCode);
