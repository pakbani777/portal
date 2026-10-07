const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

const bulkEndpoint = `
app.post('/api/users/delete-bulk', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Daftar ID pengguna kosong' });
    }

    // Ambil data users untuk dihapus di tabel siswa juga
    const { data: users, error: fetchErr } = await supabase.from('users').select('*').in('id', ids);
    if (fetchErr) throw fetchErr;

    const studentNames = users.filter(u => u.role === 'siswa').map(u => u.nama);
    
    if (studentNames.length > 0) {
      await supabase.from('siswa').delete().in('nama', studentNames);
    }
    
    const { error: delErr } = await supabase.from('users').delete().in('id', ids);
    if (delErr) throw delErr;

    res.json({ success: true, message: \`Berhasil menghapus \${ids.length} pengguna\` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
`;

if (!code.includes("app.post('/api/users/delete-bulk'")) {
  code = code.replace(
    "app.delete('/api/users/:id', async (req, res) => {",
    bulkEndpoint + "\napp.delete('/api/users/:id', async (req, res) => {"
  );
  fs.writeFileSync('server/index.js', code);
  console.log('Added POST /api/users/delete-bulk');
}
