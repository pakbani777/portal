const fs = require('fs');
let code = fs.readFileSync('client/src/App.jsx', 'utf8');

code = code.replace("import JadwalPage from './pages/JadwalPage';", "import TugasPage from './pages/TugasPage';");
code = code.replace("import KuisPage from './pages/KuisPage';\n", "");

code = code.replace("      case 'jadwal':\n        return <JadwalPage />;\n", "");
code = code.replace(
  "      case 'kuis':\n        return <KuisPage />;\n",
  "      case 'tugas':\n        return <TugasPage />;\n"
);

fs.writeFileSync('client/src/App.jsx', code);
