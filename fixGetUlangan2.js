const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

const strStart = "app.get('/api/ulangan', async (req, res) => {";
const strEnd = "res.status(500).json({ success: false, message: error.message });\n  }\n});";
const strEnd2 = "res.status(500).json({ success: false, message: error.message });\r\n  }\r\n});";

const idxStart = code.indexOf(strStart);
let idxEnd = code.indexOf(strEnd, idxStart);
let endLen = strEnd.length;

if (idxEnd === -1) {
  idxEnd = code.indexOf(strEnd2, idxStart);
  endLen = strEnd2.length;
}

if (idxStart > -1 && idxEnd > -1) {
  const before = code.substring(0, idxStart);
  const after = code.substring(idxEnd + endLen);
  
  const newLogic = `app.get('/api/ulangan', async (req, res) => {
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

    // Attach student score if nama_siswa is provided
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

  fs.writeFileSync('server/index.js', before + newLogic + after);
  console.log("Replaced GET /api/ulangan successfully");
} else {
  console.log("Could not find start or end");
}
