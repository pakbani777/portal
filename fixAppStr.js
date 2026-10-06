const fs = require('fs');
let code = fs.readFileSync('client/src/App.jsx', 'utf8');

code = code.replace("case 'jadwal':\n        return <JadwalPage />;\n", "");
code = code.replace("case 'kuis':\n        return <KuisPage />;\n", "case 'tugas':\n        return <TugasPage />;\n");
code = code.replace("import KuisPage from './pages/KuisPage';\n", "");

fs.writeFileSync('client/src/App.jsx', code);
