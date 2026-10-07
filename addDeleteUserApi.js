const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

const newEndpoint = `
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { data: user, error: fetchErr } = await supabase.from('users').select('*').eq('id', req.params.id).limit(1);
    if (fetchErr) throw fetchErr;
    if (!user || user.length === 0) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

    if (user[0].role === 'siswa') {
      await supabase.from('siswa').delete().eq('nama', user[0].nama);
    }
    
    const { error: delErr } = await supabase.from('users').delete().eq('id', req.params.id);
    if (delErr) throw delErr;

    res.json({ success: true, message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
`;

if (!code.includes("app.delete('/api/users/:id'")) {
  code = code.replace(
    "app.get('/api/users', async (req, res) => {",
    newEndpoint + "\napp.get('/api/users', async (req, res) => {"
  );
  fs.writeFileSync('server/index.js', code);
  console.log('Added DELETE /api/users/:id');
}
