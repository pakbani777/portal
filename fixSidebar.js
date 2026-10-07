const fs = require('fs');
let code = fs.readFileSync('client/src/components/Sidebar.jsx', 'utf8');

const oldNavItems = `  const navItems = [
    { id: 'dashboard', label: 'Beranda', desc: 'Ringkasan & KBM', icon: LayoutDashboard },
    { id: 'materi', label: 'Materi Pembelajaran', desc: \`PAI Kelas \${activeKelas}\`, icon: BookOpen },
    { id: 'jadwal', label: 'Jadwal Pelajaran', desc: 'Agenda Mingguan', icon: Calendar },
    { id: 'absensi', label: 'Presensi Bulanan', desc: 'Kelola Kehadiran', icon: UserCheck },
    { id: 'kuis', label: 'Kuis Interaktif', desc: 'Latihan & Nilai', icon: Award },
    { id: 'ulangan', label: 'Ulangan CBT', desc: 'Ujian UH/PTS/PAS', icon: FileSpreadsheet },
    ...(activeRole === 'guru' ? [{ id: 'admin', label: 'Panel Pak Bani', desc: 'Buku Nilai & Materi', icon: Settings }] : [])
  ];`;

const newNavItems = `  const navItems = [
    { id: 'dashboard', label: 'Beranda', desc: 'Ringkasan & KBM', icon: LayoutDashboard },
    { id: 'materi', label: 'Materi Pembelajaran', desc: \`PAI Kelas \${activeKelas}\`, icon: BookOpen },
    { id: 'tugas', label: 'Pengumpulan Tugas', desc: 'Kirim Tugas PAI', icon: ClipboardList },
    { id: 'absensi', label: 'Presensi Bulanan', desc: 'Kelola Kehadiran', icon: UserCheck },
    { id: 'ulangan', label: 'Ulangan CBT', desc: 'Ujian UH/PTS/PAS', icon: FileSpreadsheet },
    ...(activeRole === 'guru' ? [{ id: 'admin', label: 'Panel Pak Bani', desc: 'Buku Nilai & Materi', icon: Settings }] : [])
  ];`;

if(code.includes('icon: Calendar')) {
  // Try regex replace to be safe
  code = code.replace(/const navItems = \[[\s\S]*?\];/, newNavItems);
  fs.writeFileSync('client/src/components/Sidebar.jsx', code);
  console.log('Fixed Sidebar.jsx');
} else {
  console.log('Could not find Calendar in Sidebar');
}
