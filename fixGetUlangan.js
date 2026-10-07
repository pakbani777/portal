const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

const regex = /app\.get\('\/api\/ulangan', async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ success: false, message: error\.message \}\);\n  \}\);\n/;

const newLogic = `app.get('/api/ulangan', async (req, res) => {
  try {
    const { kelas, nama_siswa } = req.query;
    let query = supabase.from('ulangan').select('id, kelas, jenis, judul, durasi_menit, token_ujian')
      .order('kelas', { ascending: true })
      .order('id', { ascending: true });

    if (kelas && kelas !== 'all') {
      query = query.eq('kelas', kelas);
    }
    
    const { data: items, error } = await query;
    if (error) throw error;

    // Attach student score if nama_siswa is provided
    let results = items;
    if (nama_siswa) {
      const { data: nilaiList } = await supabase.from('nilai').select('ref_id, skor').eq('tipe', 'ulangan').eq('nama_siswa', nama_siswa);
      
      const nilaiMap = {};
      if (nilaiList) {
        nilaiList.forEach(n => {
          nilaiMap[n.ref_id] = n.skor;
        });
      }

      results = items.map(u => ({
        ...u,
        sudah_dikerjakan: nilaiMap[u.id] !== undefined,
        skor_terakhir: nilaiMap[u.id] !== undefined ? nilaiMap[u.id] : null
      }));
    }

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
`;

if (regex.test(code)) {
  code = code.replace(regex, newLogic);
  fs.writeFileSync('server/index.js', code);
  console.log('Fixed GET /api/ulangan with student score check');
} else {
  console.log('Could not find GET /api/ulangan');
}
