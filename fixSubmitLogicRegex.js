const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

const regex = /app\.post\('\/api\/ulangan\/submit', async \(req, res\) => \{[\s\S]*?const skor = Math\.round\(\(jawabanBenar \/ totalSoal\) \* 100\);/;

const newLogic = `app.post('/api/ulangan/submit', async (req, res) => {
  try {
    const { ulangan_id, nama_siswa, kelas, jawaban } = req.body;
    const { data: items, error: fetchError } = await supabase.from('ulangan').select('*').eq('id', ulangan_id).limit(1);
    if (fetchError) throw fetchError;
    if (!items || items.length === 0) return res.status(404).json({ success: false, message: 'Ulangan tidak ditemukan' });

    // Cek apakah siswa sudah mengerjakan sebelumnya
    const { data: existing, error: existErr } = await supabase.from('nilai')
      .select('id')
      .eq('ulangan_id', ulangan_id)
      .eq('nama_siswa', nama_siswa)
      .limit(1);
    if (existErr) throw existErr;
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Anda sudah mengerjakan ujian ini sebelumnya' });
    }

    const item = items[0];
    const soalList = typeof item.soal_json === 'string' ? JSON.parse(item.soal_json) : item.soal_json;
    let jawabanBenar = 0;
    let totalBobot = 0;
    let skorDiperoleh = 0;
    const totalSoal = soalList.length;

    const evaluasi = soalList.map((s) => {
      const userAns = jawaban[s.id] !== undefined ? jawaban[s.id] : -1;
      const isCorrect = userAns === s.kunci;
      const bobot = typeof s.bobot === 'number' ? s.bobot : 1;
      
      totalBobot += bobot;
      
      if (isCorrect) {
        jawabanBenar++;
        skorDiperoleh += bobot;
      }
      return {
        id: s.id,
        pertanyaan: s.pertanyaan,
        pilihan: s.pilihan,
        jawabanUser: userAns,
        kunciJawaban: s.kunci,
        benar: isCorrect,
        bobot: bobot
      };
    });

    const skor = totalBobot > 0 ? Math.round((skorDiperoleh / totalBobot) * 100) : 0;`;

if (regex.test(code)) {
  code = code.replace(regex, newLogic);
  fs.writeFileSync('server/index.js', code);
  console.log('Fixed submit logic with regex!');
} else {
  console.log('Regex did not match.');
}
