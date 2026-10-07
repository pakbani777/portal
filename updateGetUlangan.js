const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

const oldEndpoint = `app.get('/api/ulangan', async (req, res) => {
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

const newEndpoint = `app.get('/api/ulangan', async (req, res) => {
  try {
    const { kelas, nama_siswa } = req.query;
    let query = supabase.from('ulangan').select('id, kelas, jenis, judul, durasi_menit, token_ujian, soal_json')
      .order('kelas', { ascending: true })
      .order('id', { ascending: true });

    if (kelas && kelas !== 'all') {
      query = query.eq('kelas', Number(kelas));
    }
    
    const { data: items, error } = await query;
    if (error) throw error;
    
    let ulanganData = items.map(u => ({
      ...u,
      total_soal: typeof u.soal_json === 'string' ? JSON.parse(u.soal_json).length : (u.soal_json?.length || 0)
    }));
    ulanganData.forEach(u => delete u.soal_json); // don't send answers to list

    if (nama_siswa) {
      const { data: nilaiList } = await supabase.from('nilai')
        .select('ref_id, skor, waktu_selesai')
        .eq('nama_siswa', nama_siswa)
        .eq('tipe', 'ulangan');
        
      if (nilaiList) {
        ulanganData = ulanganData.map(u => {
          const pastScore = nilaiList.find(n => n.ref_id === u.id);
          return {
            ...u,
            sudah_dikerjakan: !!pastScore,
            skor_terakhir: pastScore ? pastScore.skor : null,
            waktu_selesai: pastScore ? pastScore.waktu_selesai : null
          };
        });
      }
    }
    
    res.json({ success: true, data: ulanganData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});`;

if (code.includes("let query = supabase.from('ulangan').select('id, kelas, jenis, judul, durasi_menit, token_ujian')")) {
  code = code.replace(oldEndpoint, newEndpoint);
  fs.writeFileSync('server/index.js', code);
  console.log('GET /api/ulangan updated');
} else {
  console.log('Could not match endpoint.');
}
