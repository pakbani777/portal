const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

// Replace queries in stats
code = code.replace(
  "      const [\n        { count: totalMateri },\n        { count: totalJadwal },\n        { count: totalKuis },\n        { count: totalUlangan },\n        { data: kehadiran },\n        { data: nilai },\n        { data: pengumuman },\n        { data: jadwalHariIni },\n        { count: totalSiswaSemua },\n        { count: totalNilaiUjian }\n      ] = await Promise.all([",
  "      const [\n        { count: totalMateri },\n        { count: totalTugas },\n        { count: totalUlangan },\n        { data: kehadiran },\n        { data: nilai },\n        { data: pengumuman },\n        { data: tugasTerbaru },\n        { count: totalSiswaSemua },\n        { count: totalNilaiUjian }\n      ] = await Promise.all(["
);

code = code.replace(
  "        supabase.from('materi').select('*', { count: 'exact', head: true }).eq('kelas', kelas),\n        supabase.from('jadwal').select('*', { count: 'exact', head: true }).like('kelas', `${kelas}%`),\n        supabase.from('kuis').select('*', { count: 'exact', head: true }).eq('kelas', kelas),\n        supabase.from('ulangan').select('*', { count: 'exact', head: true }).eq('kelas', kelas),\n        supabase.from('absensi').select('status').eq('nama_siswa', namaSiswa),\n        supabase.from('nilai').select('skor').eq('nama_siswa', namaSiswa),\n        supabase.from('pengumuman').select('*').order('id', { ascending: false }).limit(3),\n        supabase.from('jadwal').select('*').like('kelas', `${kelas}%`).order('id', { ascending: true }).limit(2),\n        supabase.from('siswa').select('*', { count: 'exact', head: true }),\n        supabase.from('nilai').select('*', { count: 'exact', head: true })\n      ]);",
  "        supabase.from('materi').select('*', { count: 'exact', head: true }).eq('kelas', kelas),\n        supabase.from('tugas').select('*', { count: 'exact', head: true }).eq('kelas', kelas),\n        supabase.from('ulangan').select('*', { count: 'exact', head: true }).eq('kelas', kelas),\n        supabase.from('absensi').select('status').eq('nama_siswa', namaSiswa),\n        supabase.from('nilai').select('skor').eq('nama_siswa', namaSiswa),\n        supabase.from('pengumuman').select('*').order('id', { ascending: false }).limit(3),\n        supabase.from('tugas').select('*').eq('kelas', kelas).order('deadline', { ascending: true }).limit(2),\n        supabase.from('siswa').select('*', { count: 'exact', head: true }),\n        supabase.from('nilai').select('*', { count: 'exact', head: true })\n      ]);"
);

code = code.replace(
  "        data: {\n          totalMateri: totalMateri || 0,\n          totalJadwal: totalJadwal || 0,\n          totalKuis: totalKuis || 0,\n          totalUlangan: totalUlangan || 0,\n          totalHadir,\n          totalAbsen,\n          rataRataNilai: Math.round(avgScore),\n          jadwalHariIni: jadwalHariIni || [],\n          pengumuman: pengumuman || [],\n          totalSiswaSemua: totalSiswaSemua || 0,\n          totalNilaiUjian: totalNilaiUjian || 0\n        }",
  "        data: {\n          totalMateri: totalMateri || 0,\n          totalTugas: totalTugas || 0,\n          totalUlangan: totalUlangan || 0,\n          totalHadir,\n          totalAbsen,\n          rataRataNilai: Math.round(avgScore),\n          tugasTerbaru: tugasTerbaru || [],\n          pengumuman: pengumuman || [],\n          totalSiswaSemua: totalSiswaSemua || 0,\n          totalNilaiUjian: totalNilaiUjian || 0\n        }"
);

fs.writeFileSync('server/index.js', code);
