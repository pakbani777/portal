const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Dashboard.jsx', 'utf8');

// Replace "Jadwal KBM Terdekat" with "Tugas PAI Terdekat"
code = code.replace("Jadwal KBM PAI Terdekat", "Tugas PAI Terdekat");

// Replace "Lihat Semua Jadwal" with "Lihat Semua Tugas"
code = code.replace("Lihat Semua Jadwal", "Lihat Semua Tugas");

// Replace "setActiveTab('jadwal')" with "setActiveTab('tugas')"
code = code.replace("setActiveTab('jadwal')", "setActiveTab('tugas')");

// Replace "Memuat jadwal KBM..." with "Memuat tugas..."
code = code.replace("Memuat jadwal KBM...", "Memuat tugas...");

// Replace "Tidak ada sesi jadwal aktif untuk hari ini." with "Tidak ada tugas yang menunggu."
code = code.replace("Tidak ada sesi jadwal aktif untuk hari ini.", "Tidak ada tugas yang menunggu.");

// Replace logic for iterating
code = code.replace("stats?.jadwalHariIni && stats.jadwalHariIni.length > 0", "stats?.tugasTerbaru && stats.tugasTerbaru.length > 0");
code = code.replace("stats.jadwalHariIni.map((j)", "stats.tugasTerbaru.map((j)");

// The inner card for Jadwal usually has j.materi, j.waktu. Let's make it generic for tugas (j.judul, j.deadline)
const newCard = `
                  <div
                    key={j.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{j.judul}</h4>
                        <p className="text-xs text-slate-500 font-medium">Batas Waktu: {new Date(j.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                  </div>
`;

code = code.replace(
  /<div\s+key=\{j\.id\}\s+className="p-4 rounded-2xl bg-white border border-slate-200\/90 shadow-xs hover:border-blue-300 \ntransition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"[\s\S]*?<\/div>\n\s+<\/div>/,
  newCard
);

code = code.replace("import { Clock, PlayCircle, BookOpen, Brain, Calendar, ChevronRight, User, GraduationCap, Users, Layout, Award, FileSpreadsheet, ArrowRight, FileText } from 'lucide-react';", "import { Clock, PlayCircle, BookOpen, Brain, Calendar, ChevronRight, User, GraduationCap, Users, Layout, Award, FileSpreadsheet, ArrowRight, FileText, ClipboardList } from 'lucide-react';");

fs.writeFileSync('client/src/pages/Dashboard.jsx', code);
