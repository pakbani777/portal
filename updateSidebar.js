const fs = require('fs');
let code = fs.readFileSync('client/src/components/Sidebar.jsx', 'utf8');

code = code.replace(
  "import { LayoutDashboard, BookOpen, Calendar, UserCheck, Award, FileSpreadsheet, Settings, Sparkles , LogOut} from 'lucide-react';",
  "import { LayoutDashboard, BookOpen, ClipboardList, UserCheck, FileSpreadsheet, Settings, Sparkles, LogOut } from 'lucide-react';"
);

// Replace items
code = code.replace(
  "    { id: 'jadwal', label: 'Jadwal Pelajaran', desc: 'Agenda Mingguan', icon: Calendar },\n",
  ""
);
code = code.replace(
  "    { id: 'kuis', label: 'Kuis Interaktif', desc: 'Latihan & Nilai', icon: Award },\n",
  "    { id: 'tugas', label: 'Pengumpulan Tugas', desc: 'Kirim Tugas PAI', icon: ClipboardList },\n"
);

fs.writeFileSync('client/src/components/Sidebar.jsx', code);
