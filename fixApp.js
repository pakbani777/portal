const fs = require('fs');
let code = fs.readFileSync('client/src/App.jsx', 'utf8');

code = code.replace(/import KuisPage from '\.\/pages\/KuisPage';\n?/, '');
code = code.replace(/case 'jadwal':\n\s*return <JadwalPage \/>;\n?/, '');
code = code.replace(/case 'kuis':\n\s*return <KuisPage \/>;\n?/, "case 'tugas':\n        return <TugasPage />;\n");

fs.writeFileSync('client/src/App.jsx', code);
