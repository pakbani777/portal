const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

const newEndpoint = `
app.post('/api/ulangan', async (req, res) => {
  try {
    const { kelas, jenis, judul, durasi_menit, token_ujian, soal_json } = req.body;
    if (!kelas || !jenis || !judul || !token_ujian || !soal_json) {
      return res.status(400).json({ success: false, message: 'Harap lengkapi semua field' });
    }
    const { data, error } = await supabase.from('ulangan').insert([{
      kelas, jenis, judul, durasi_menit, token_ujian,
      soal_json: typeof soal_json === 'string' ? soal_json : JSON.stringify(soal_json)
    }]).select();
    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
`;

if (!code.includes("app.post('/api/ulangan',")) {
  // Insert before app.get('/api/ulangan',
  code = code.replace("app.get('/api/ulangan',", newEndpoint + "\napp.get('/api/ulangan',");
  fs.writeFileSync('server/index.js', code);
  console.log("Endpoint POST /api/ulangan added.");
}
