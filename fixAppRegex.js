const fs = require('fs');
let code = fs.readFileSync('client/src/App.jsx', 'utf8');

code = code.replace(/case 'jadwal':\s*return <JadwalPage \/>;\s*/, "");
code = code.replace(/case 'kuis':\s*return <KuisPage \/>;\s*/, "case 'tugas':\n        return <TugasPage />;\n");
code = code.replace(/import KuisPage from '.\/pages\/KuisPage';\s*/, "");

fs.writeFileSync('client/src/App.jsx', code);
