const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

// 1. Fix ref_id in POST /api/ulangan/submit
code = code.replace(
  "eq('ulangan_id', ulangan_id)",
  "eq('ref_id', ulangan_id).eq('tipe', 'ulangan')"
);

code = code.replace(
  "ref_id: ulangan_id",
  "ref_id: ulangan_id" // Already correct? wait, it was correct in HEAD~1
);

// 2. Fix GET /api/ulangan
const oldGet = `app.get('/api/ulangan', async (req, res) => {
  try {
    const { kelas } = req.query;
    let query = supabase.from('ulangan').select('id, kelas, jenis, judul, durasi_menit, token_ujian')
      .order('kelas', { ascending: true })
      .order('id', { ascending: true });

    if (kelas && kelas !== 'all') {
      query = query.eq('kelas', Number(kelas));
    }
    
    const { data: items, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});`;

const newGet = `app.get('/api/ulangan', async (req, res) => {
  try {
    const { kelas, nama_siswa } = req.query;
    let query = supabase.from('ulangan').select('id, kelas, jenis, judul, durasi_menit, token_ujian')
      .order('kelas', { ascending: true })
      .order('id', { ascending: true });

    if (kelas && kelas !== 'all') {
      query = query.eq('kelas', String(kelas));
    }
    
    const { data: items, error } = await query;
    if (error) throw error;

    let results = items || [];
    if (nama_siswa) {
      const { data: nilaiList } = await supabase.from('nilai').select('ref_id, skor').eq('tipe', 'ulangan').eq('nama_siswa', nama_siswa);
      
      const nilaiMap = {};
      if (nilaiList) {
        nilaiList.forEach(n => {
          nilaiMap[n.ref_id] = n.skor;
        });
      }

      results = results.map(u => ({
        ...u,
        sudah_dikerjakan: nilaiMap[u.id] !== undefined,
        skor_terakhir: nilaiMap[u.id] !== undefined ? nilaiMap[u.id] : null
      }));
    }

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});`;

if (code.includes('query.eq(\'kelas\', Number(kelas));')) {
  // Try CRLF fallback
  code = code.split(oldGet).join(newGet);
  // Just in case it's CRLF
  const oldGetCRLF = oldGet.replace(/\n/g, '\r\n');
  code = code.split(oldGetCRLF).join(newGet);
  
  fs.writeFileSync('server/index.js', code);
  console.log('Fixed GET /api/ulangan cleanly');
} else {
  console.log('Could not find GET /api/ulangan exactly');
}
