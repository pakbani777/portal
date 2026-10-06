const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

const tugasRoutes = `
// ==========================================
// 11. PENGUMPULAN TUGAS
// ==========================================
app.get('/api/tugas', async (req, res) => {
  try {
    const { kelas } = req.query;
    let query = supabase.from('tugas').select('*').order('deadline', { ascending: true });
    if (kelas && kelas !== 'all') {
      query = query.eq('kelas', String(kelas));
    }
    const { data: items, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: items || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/tugas', async (req, res) => {
  try {
    const { judul, deskripsi, deadline, kelas } = req.body;
    const { data: inserted, error } = await supabase.from('tugas').insert([{
      judul, deskripsi, deadline, kelas: String(kelas)
    }]).select();
    if (error) throw error;
    res.json({ success: true, data: inserted[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/tugas/:id/submit', async (req, res) => {
  try {
    const { nama_siswa, kelas, file_url, catatan } = req.body;
    const { data: inserted, error } = await supabase.from('tugas_submissions').insert([{
      tugas_id: req.params.id,
      nama_siswa,
      kelas: String(kelas),
      file_url,
      catatan
    }]).select();
    if (error) throw error;
    res.json({ success: true, data: inserted[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/tugas/:id/submissions', async (req, res) => {
  try {
    const { data: items, error } = await supabase.from('tugas_submissions').select('*').eq('tugas_id', req.params.id).order('submitted_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data: items || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
`;

code = code.replace("// Serving static frontend jika dist tersedia", tugasRoutes + "\n// Serving static frontend jika dist tersedia");
fs.writeFileSync('server/index.js', code);
