const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Dashboard.jsx', 'utf8');

code = code.replace(
  "{ label: 'Jadwal', val: stats?.totalJadwal || 0, icon: Calendar, color: 'text-sky-600', bg: 'bg-sky-50' },",
  "{ label: 'Tugas', val: stats?.totalTugas || 0, icon: FileText, color: 'text-sky-600', bg: 'bg-sky-50' },"
);
code = code.replace(
  "{ label: 'Kuis', val: stats?.totalKuis || 0, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },",
  ""
);

// We need to change grid-cols-4 to grid-cols-3 since we removed Kuis
code = code.replace(
  'className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"',
  'className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6"'
);

fs.writeFileSync('client/src/pages/Dashboard.jsx', code);
