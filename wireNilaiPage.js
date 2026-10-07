const fs = require('fs');

// 1. App.jsx
let appCode = fs.readFileSync('client/src/App.jsx', 'utf8');
if (!appCode.includes('import NilaiPage')) {
  appCode = appCode.replace(
    "import GuruAdminPage from './pages/GuruAdminPage';",
    "import GuruAdminPage from './pages/GuruAdminPage';\nimport NilaiPage from './pages/NilaiPage';"
  );
  
  appCode = appCode.replace(
    "case 'ulangan':\n          return <UlanganPage />;",
    "case 'ulangan':\n          return <UlanganPage />;\n        case 'nilai':\n          return <NilaiPage />;"
  );
  // CRLF fallback
  appCode = appCode.replace(
    "case 'ulangan':\r\n          return <UlanganPage />;",
    "case 'ulangan':\r\n          return <UlanganPage />;\r\n        case 'nilai':\r\n          return <NilaiPage />;"
  );
  
  fs.writeFileSync('client/src/App.jsx', appCode);
  console.log('App.jsx updated');
}

// 2. Sidebar.jsx
let sidebarCode = fs.readFileSync('client/src/components/Sidebar.jsx', 'utf8');
if (!sidebarCode.includes("{ id: 'nilai'")) {
  sidebarCode = sidebarCode.replace(
    "import { LayoutDashboard, BookOpen, ClipboardList, UserCheck, FileSpreadsheet, Settings, Sparkles, LogOut } from 'lucide-react';",
    "import { LayoutDashboard, BookOpen, ClipboardList, UserCheck, FileSpreadsheet, Settings, Sparkles, LogOut, Award } from 'lucide-react';"
  );
  
  sidebarCode = sidebarCode.replace(
    "{ id: 'ulangan', label: 'Ulangan CBT', desc: 'Ujian UH/PTS/PAS', icon: FileSpreadsheet },",
    "{ id: 'ulangan', label: 'Ulangan CBT', desc: 'Ujian UH/PTS/PAS', icon: FileSpreadsheet },\n    { id: 'nilai', label: 'Buku Nilai', desc: 'Rekap Nilai Siswa', icon: Award },"
  );
  
  fs.writeFileSync('client/src/components/Sidebar.jsx', sidebarCode);
  console.log('Sidebar.jsx updated');
}
