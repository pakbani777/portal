const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const fs = require('fs');

const supabaseUrl = 'https://bodfmgacldijewceqymz.supabase.co';
const supabaseKey = 'sb_publishable_Iz9gGDjlhnGZeKS9DUVuQQ_7Dg6Q0lK';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logging middleware sederhana
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Pastikan folder uploads ada
const uploadDir = '/tmp';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'profile_' + Date.now() + ext);
  }
});
const upload = multer({ storage: storage });

app.use('/public', express.static(path.join(__dirname, 'public')));


// ==========================================
// 1. AUTENTIKASI LOGIN (GURU & SISWA)
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username / NISN dan Kata Sandi wajib diisi' });
    }

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Cek di database users
    let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.ilike.${cleanUser},nisn_nip.eq.${username.trim()}`)
      .eq('password', cleanPass)
      .limit(1);

    let user = users && users.length > 0 ? users[0] : null;

    // Fallback autentikasi jika user login dengan NISN dari tabel siswa
    if (!user) {
      const { data: siswas } = await supabase
        .from('siswa')
        .select('*')
        .or(`nisn.eq.${username.trim()},nama.ilike.%${cleanUser}%`)
        .limit(1);
        
      const siswa = siswas && siswas.length > 0 ? siswas[0] : null;
      if (siswa && cleanPass === 'siswa123') {
        user = {
          id: siswa.id,
          username: siswa.nama.toLowerCase().replace(/\s+/g, ''),
          role: 'siswa',
          nama: siswa.nama,
          nisn_nip: siswa.nisn,
          kelas: siswa.kelas
        };
      }
    }

    // Fallback autentikasi akun default Pak Bani
    if (!user && (cleanUser === 'pakbani' || cleanUser === 'admin') && (cleanPass === 'pakbani123' || cleanPass === 'admin123')) {
      user = {
        id: 1,
        username: 'pakbani',
        role: 'guru',
        nama: 'Pak Bani, S.Pd.I',
        nisn_nip: '19870815 201201 1 009',
        kelas: 'Semua Kelas (7, 8, 9)'
      };
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Username/NISN atau Kata Sandi salah! Silakan periksa kembali.'
      });
    }

    res.json({
      success: true,
      message: `Selamat datang, ${user.nama}!`,
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        nama: user.nama,
        nisn_nip: user.nisn_nip,
        kelas: user.kelas,
        foto_profil: user.foto_profil || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 1B. PROFIL & UPLOAD FOTO
// ==========================================
app.post('/api/users/profile', upload.single('foto'), async (req, res) => {
  try {
    const { id, nama, username, password } = req.body;
    if (!id || !nama || !username) {
      return res.status(400).json({ success: false, message: 'ID, Nama, dan Username wajib diisi' });
    }

    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .limit(1);

    if (fetchError) throw fetchError;
    const user = users && users.length > 0 ? users[0] : null;
    
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

    let foto_profil = user.foto_profil;
    if (req.file) {
      foto_profil = `/public/uploads/${req.file.filename}`;
    }

    let updateData = { nama, username, foto_profil };
    if (password && password.trim() !== '') {
      updateData.password = password.trim();
    }

    const { error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id);

    if (updateError) throw updateError;
    
    const { data: updatedUsers, error: fetchUpdatedError } = await supabase
      .from('users')
      .select('id, username, role, nama, nisn_nip, kelas, foto_profil')
      .eq('id', id)
      .limit(1);

    if (fetchUpdatedError) throw fetchUpdatedError;

    res.json({ success: true, message: 'Profil berhasil diperbarui', data: updatedUsers[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 1C. MANAJEMEN PENGGUNA (Oleh Admin/Guru)
// ==========================================


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

    res.json({ success: true, message: `Berhasil menghapus ${ids.length} pengguna` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

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

app.get('/api/users', async (req, res) => {
  try {
    const { data: items, error } = await supabase
      .from('users')
      .select('id, username, role, nama, nisn_nip, kelas, foto_profil')
      .order('role', { ascending: true })
      .order('nama', { ascending: true });
      
    if (error) throw error;
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/users/bulk', async (req, res) => {
  try {
    const { kelas, defaultPassword, users: newUsers } = req.body;
    if (!newUsers || !Array.isArray(newUsers) || newUsers.length === 0) {
      return res.status(400).json({ success: false, message: 'Daftar pengguna kosong' });
    }

    // 1. Prepare data for 'users' table
    const usersData = newUsers.map((u, i) => ({
      username: (u.nisn || (u.nama.replace(/\s+/g, '').toLowerCase() + Date.now().toString(36) + i)).substring(0, 50),
      password: defaultPassword || 'siswa123',
      role: 'siswa',
      nama: u.nama,
      nisn_nip: u.nisn ? u.nisn : null,
      kelas: kelas
    }));

    // 2. Prepare data for 'siswa' table
    const siswaData = newUsers.map(u => ({
      nisn: u.nisn ? u.nisn : null,
      nama: u.nama,
      kelas: kelas,
      gender: 'L'
    }));

    // Insert to users table
    const { error: userErr } = await supabase.from('users').insert(usersData);
    if (userErr) throw userErr;

    // Insert to siswa table
    const { error: siswaErr } = await supabase.from('siswa').insert(siswaData);
    if (siswaErr) throw siswaErr;

    res.json({ success: true, message: `Berhasil menginput ${siswaData.length} siswa kelas ${kelasTarget}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username, password, role, nama, nisn_nip, kelas, gender } = req.body;
    if (!username || !password || !nama || !role) {
      return res.status(400).json({ success: false, message: 'Username, Password, Nama, dan Role wajib diisi' });
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .limit(1);
      
    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan' });
    }

    const { error: insertError } = await supabase
      .from('users')
      .insert([{
        username,
        password,
        role,
        nama,
        nisn_nip: nisn_nip || '',
        kelas: kelas || ''
      }]);
      
    if (insertError) throw insertError;

    if (role === 'siswa' && nisn_nip && kelas) {
      const { data: existSiswa } = await supabase
        .from('siswa')
        .select('id')
        .eq('nisn', nisn_nip)
        .limit(1);
        
      if (!existSiswa || existSiswa.length === 0) {
        await supabase
          .from('siswa')
          .insert([{
            nisn: nisn_nip,
            nama,
            kelas,
            gender: gender || 'L'
          }]);
      }
    }

    res.json({ success: true, message: 'Pengguna baru berhasil ditambahkan' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    if (!password || password.trim() === '') {
      return res.status(400).json({ success: false, message: 'Password baru tidak boleh kosong' });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ password })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    res.json({ success: true, message: 'Password berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. DAFTAR SISWA RESMI
// ==========================================
app.get('/api/siswa', async (req, res) => {
  try {
    const { kelas } = req.query;
    let query = supabase.from('siswa').select('*').order('nama', { ascending: true });
    
    if (kelas && kelas !== 'all') {
      query = query.like('kelas', `${kelas}%`);
    }
    
    const { data: items, error } = await query;
    if (error) throw error;
    
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. STATS & DASHBOARD
// ==========================================
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const kelas = req.query.kelas || '7';
    const namaSiswa = req.query.nama || 'Ahmad Fauzi';

    const [
      { count: totalMateri },
      { count: totalJadwal },
      { count: totalKuis },
      { count: totalUlangan },
      { data: kehadiran },
      { data: nilai },
      { data: pengumuman },
      { data: jadwalHariIni },
      { count: totalSiswaSemua },
      { count: totalNilaiUjian }
    ] = await Promise.all([
      supabase.from('materi').select('*', { count: 'exact', head: true }).eq('kelas', kelas),
      supabase.from('jadwal').select('*', { count: 'exact', head: true }).like('kelas', `${kelas}%`),
      supabase.from('kuis').select('*', { count: 'exact', head: true }).eq('kelas', kelas),
      supabase.from('ulangan').select('*', { count: 'exact', head: true }).eq('kelas', kelas),
      supabase.from('absensi').select('status').eq('nama_siswa', namaSiswa),
      supabase.from('nilai').select('skor').eq('nama_siswa', namaSiswa),
      supabase.from('pengumuman').select('*').order('id', { ascending: false }).limit(3),
      supabase.from('jadwal').select('*').like('kelas', `${kelas}%`).order('id', { ascending: true }).limit(2),
      supabase.from('siswa').select('*', { count: 'exact', head: true }),
      supabase.from('nilai').select('*', { count: 'exact', head: true })
    ]);

    const statusCounts = (kehadiran || []).reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});
    
    const totalAbsen = (kehadiran || []).length;
    const totalHadir = statusCounts['Hadir'] || 0;
    const persentaseKehadiran = totalAbsen > 0 ? Math.round((totalHadir / totalAbsen) * 100) : 100;

    let avgScore = 88;
    if (nilai && nilai.length > 0) {
      const sum = nilai.reduce((acc, curr) => acc + curr.skor, 0);
      avgScore = sum / nilai.length;
    }

    res.json({
      success: true,
      data: {
        totalMateri: totalMateri || 0,
        totalJadwal: totalJadwal || 0,
        totalKuis: totalKuis || 0,
        totalUlangan: totalUlangan || 0,
        persentaseKehadiran,
        totalHadir,
        totalAbsen,
        rataRataNilai: Math.round(avgScore),
        jadwalHariIni: jadwalHariIni || [],
        pengumuman: pengumuman || [],
        totalSiswaSemua: totalSiswaSemua || 0,
        totalNilaiUjian: totalNilaiUjian || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. MODUL MATERI PEMBELAJARAN
// ==========================================
app.get('/api/materi', async (req, res) => {
  try {
    const { kelas, kategori, search } = req.query;
    let query = supabase.from('materi').select('*')
      .order('kelas', { ascending: true })
      .order('bab', { ascending: true })
      .order('urutan', { ascending: true });

    if (kelas && kelas !== 'all') {
      query = query.eq('kelas', Number(kelas));
    }
    if (kategori && kategori !== 'all') {
      query = query.eq('kategori', kategori);
    }
    if (search) {
      query = query.or(`judul.ilike.%${search}%,deskripsi.ilike.%${search}%,konten.ilike.%${search}%`);
    }

    const { data: items, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/materi/:id', async (req, res) => {
  try {
    const { data: items, error } = await supabase.from('materi').select('*').eq('id', req.params.id).limit(1);
    if (error) throw error;
    if (!items || items.length === 0) return res.status(404).json({ success: false, message: 'Materi tidak ditemukan' });
    res.json({ success: true, data: items[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/materi', async (req, res) => {
  try {
    const { kelas, bab, judul, kategori, ayat_arab, arti_ayat, deskripsi, konten, rujukan } = req.body;
    if (!kelas || !bab || !judul || !konten) {
      return res.status(400).json({ success: false, message: 'Data wajib diisi (kelas, bab, judul, konten)' });
    }

    const { error } = await supabase.from('materi').insert([{
      kelas, bab, judul, kategori: kategori || 'Umum', 
      ayat_arab: ayat_arab || '', arti_ayat: arti_ayat || '', 
      deskripsi: deskripsi || '', konten, rujukan: rujukan || ''
    }]);

    if (error) throw error;
    res.json({ success: true, message: 'Materi berhasil ditambahkan oleh Pak Bani' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 5. JADWAL PELAJARAN
// ==========================================
app.get('/api/jadwal', async (req, res) => {
  try {
    const { kelas, hari } = req.query;
    let query = supabase.from('jadwal').select('*').order('id', { ascending: true });

    if (kelas && kelas !== 'all') {
      query = query.like('kelas', `${kelas}%`);
    }
    if (hari && hari !== 'all') {
      query = query.eq('hari', hari);
    }

    const { data: items, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 6. ABSENSI BULANAN & PENGELOLAAN GURU
// ==========================================
app.get('/api/absensi/bulanan', async (req, res) => {
  try {
    const kelas = req.query.kelas || '7-A';
    const bulan = req.query.bulan || new Date().toISOString().substring(0, 7);

    const [{ data: siswaList }, { data: records }] = await Promise.all([
      supabase.from('siswa').select('*').eq('kelas', kelas).order('nama', { ascending: true }),
      supabase.from('absensi').select('*').eq('kelas', kelas).like('tanggal', `${bulan}%`).order('tanggal', { ascending: true }).order('nama_siswa', { ascending: true })
    ]);

    const tanggalSet = new Set();
    (records || []).forEach(r => tanggalSet.add(r.tanggal));
    const tanggalList = Array.from(tanggalSet).sort();

    const matrix = {};
    const rekapSiswa = {};

    (siswaList || []).forEach(s => {
      matrix[s.nama] = {};
      rekapSiswa[s.nama] = {
        nisn: s.nisn,
        gender: s.gender,
        H: 0,
        S: 0,
        I: 0,
        A: 0,
        total: 0,
        persen: 100
      };
    });

    (records || []).forEach(r => {
      if (!matrix[r.nama_siswa]) matrix[r.nama_siswa] = {};
      matrix[r.nama_siswa][r.tanggal] = {
        status: r.status,
        keterangan: r.keterangan,
        waktu: r.waktu
      };

      if (!rekapSiswa[r.nama_siswa]) {
        rekapSiswa[r.nama_siswa] = { nisn: r.nisn || '', gender: '-', H: 0, S: 0, I: 0, A: 0, total: 0, persen: 100 };
      }

      if (r.status === 'Hadir') rekapSiswa[r.nama_siswa].H++;
      else if (r.status === 'Sakit') rekapSiswa[r.nama_siswa].S++;
      else if (r.status === 'Izin') rekapSiswa[r.nama_siswa].I++;
      else if (r.status === 'Alpa') rekapSiswa[r.nama_siswa].A++;

      rekapSiswa[r.nama_siswa].total++;
    });

    Object.keys(rekapSiswa).forEach(nama => {
      const item = rekapSiswa[nama];
      if (item.total > 0) {
        item.persen = Math.round((item.H / item.total) * 100);
      }
    });

    let totalH = 0, totalS = 0, totalI = 0, totalA = 0;
    (records || []).forEach(r => {
      if (r.status === 'Hadir') totalH++;
      else if (r.status === 'Sakit') totalS++;
      else if (r.status === 'Izin') totalI++;
      else if (r.status === 'Alpa') totalA++;
    });
    const totalAll = totalH + totalS + totalI + totalA;
    const rekapKelas = {
      Hadir: totalH,
      Sakit: totalS,
      Izin: totalI,
      Alpa: totalA,
      totalPertemuan: tanggalList.length,
      totalEntri: totalAll,
      persentase: totalAll > 0 ? Math.round((totalH / totalAll) * 100) : 100
    };

    res.json({
      success: true,
      data: {
        kelas,
        bulan,
        daftarSiswa: siswaList || [],
        tanggalList,
        matrix,
        rekapSiswa,
        rekapKelas
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/absensi/batch', async (req, res) => {
  try {
    const { kelas, tanggal, listAbsensi } = req.body;
    if (!kelas || !tanggal || !Array.isArray(listAbsensi)) {
      return res.status(400).json({ success: false, message: 'Format data presensi tidak lengkap' });
    }

    const waktu = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    for (const item of listAbsensi) {
      const { data: exist } = await supabase
        .from('absensi')
        .select('id')
        .eq('kelas', kelas)
        .eq('tanggal', tanggal)
        .eq('nama_siswa', item.nama_siswa)
        .limit(1);

      if (exist && exist.length > 0) {
        await supabase
          .from('absensi')
          .update({
            status: item.status,
            keterangan: item.keterangan || (item.status === 'Hadir' ? 'Hadir di kelas' : item.status),
            waktu
          })
          .eq('id', exist[0].id);
      } else {
        await supabase
          .from('absensi')
          .insert([{
            kelas,
            nama_siswa: item.nama_siswa,
            nisn: item.nisn || '',
            tanggal,
            status: item.status,
            keterangan: item.keterangan || (item.status === 'Hadir' ? 'Hadir di kelas' : item.status),
            waktu
          }]);
      }
    }

    res.json({
      success: true,
      message: `Presensi kelas ${kelas} tanggal ${tanggal} berhasil disimpan oleh Pak Bani!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 7. KUIS INTERAKTIF
// ==========================================
app.get('/api/kuis', async (req, res) => {
  try {
    const { kelas } = req.query;
    let query = supabase.from('kuis').select('id, kelas, bab, judul, kategori, durasi_menit')
      .order('kelas', { ascending: true })
      .order('bab', { ascending: true });

    if (kelas && kelas !== 'all') {
      query = query.eq('kelas', Number(kelas));
    }
    
    const { data: items, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/kuis/:id', async (req, res) => {
  try {
    const { data: items, error } = await supabase.from('kuis').select('*').eq('id', req.params.id).limit(1);
    if (error) throw error;
    if (!items || items.length === 0) return res.status(404).json({ success: false, message: 'Kuis tidak ditemukan' });

    const item = items[0];
    item.soal = typeof item.soal_json === 'string' ? JSON.parse(item.soal_json) : item.soal_json;
    delete item.soal_json;
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/kuis/submit', async (req, res) => {
  try {
    const { kuis_id, nama_siswa, kelas, jawaban } = req.body;
    const { data: items, error: kuisError } = await supabase.from('kuis').select('*').eq('id', kuis_id).limit(1);
    if (kuisError) throw kuisError;
    if (!items || items.length === 0) return res.status(404).json({ success: false, message: 'Kuis tidak ditemukan' });

    const item = items[0];
    const soalList = typeof item.soal_json === 'string' ? JSON.parse(item.soal_json) : item.soal_json;
    let jawabanBenar = 0;
    
    const evaluasi = soalList.map((s) => {
      const userAns = jawaban[s.id] !== undefined ? jawaban[s.id] : -1;
      const isCorrect = userAns === s.kunci;
      if (isCorrect) jawabanBenar++;
      return {
        soalId: s.id,
        pertanyaan: s.pertanyaan,
        pilihan: s.pilihan,
        jawabanUser: userAns,
        kunciJawaban: s.kunci,
        benar: isCorrect,
        pembahasan: s.pembahasan
      };
    });

    const totalSoal = soalList.length;
    const skor = Math.round((jawabanBenar / totalSoal) * 100);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const { error: insertError } = await supabase.from('nilai').insert([{
      tipe: 'kuis',
      ref_id: kuis_id,
      nama_siswa: nama_siswa || 'Siswa PAI',
      kelas: String(kelas || item.kelas),
      skor,
      total_soal: totalSoal,
      jawaban_benar: jawabanBenar,
      waktu_selesai: now
    }]);
    
    if (insertError) throw insertError;

    res.json({
      success: true,
      data: {
        skor,
        totalSoal,
        jawabanBenar,
        evaluasi,
        pesan: skor >= 75 ? 'Mumtaz! Hasil yang sangat membanggakan dari Pak Bani.' : 'Tetap semangat! Tingkatkan pemahaman materi PAI Anda.'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 8. ULANGAN ONLINE (CBT)
// ==========================================

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

app.get('/api/ulangan', async (req, res) => {
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
});

app.get('/api/ulangan/:id', async (req, res) => {
  try {
    const { data: items, error } = await supabase.from('ulangan').select('*').eq('id', req.params.id).limit(1);
    if (error) throw error;
    if (!items || items.length === 0) return res.status(404).json({ success: false, message: 'Ulangan tidak ditemukan' });

    const item = items[0];
    item.soal = typeof item.soal_json === 'string' ? JSON.parse(item.soal_json) : item.soal_json;
    delete item.soal_json;
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/ulangan/submit', async (req, res) => {
  try {
    const { ulangan_id, nama_siswa, kelas, jawaban } = req.body;
    const { data: items, error: fetchError } = await supabase.from('ulangan').select('*').eq('id', ulangan_id).limit(1);
    if (fetchError) throw fetchError;
    if (!items || items.length === 0) return res.status(404).json({ success: false, message: 'Ulangan tidak ditemukan' });

    // Cek apakah siswa sudah mengerjakan sebelumnya
    const { data: existing, error: existErr } = await supabase.from('nilai')
      .select('id')
      .eq('ref_id', ulangan_id).eq('tipe', 'ulangan')
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

    const skor = totalBobot > 0 ? Math.round((skorDiperoleh / totalBobot) * 100) : 0;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const { error: insertError } = await supabase.from('nilai').insert([{
      tipe: 'ulangan',
      ref_id: ulangan_id,
      nama_siswa: nama_siswa || 'Siswa PAI',
      kelas: String(kelas || item.kelas),
      skor,
      total_soal: totalSoal,
      jawaban_benar: jawabanBenar,
      waktu_selesai: now
    }]);

    if (insertError) throw insertError;

    res.json({
      success: true,
      data: {
        skor,
        totalSoal,
        jawabanBenar,
        evaluasi,
        waktuSelesai: now,
        judul: item.judul
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 9. NILAI & REKAP
// ==========================================
app.get('/api/nilai', async (req, res) => {
  try {
    const { nama, kelas } = req.query;
    let query = supabase.from('nilai').select('*').order('id', { ascending: false });

    if (nama) {
      query = query.eq('nama_siswa', nama);
    }
    if (kelas && kelas !== 'all') {
      query = query.eq('kelas', String(kelas));
    }

    const { data: items, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 10. PENGUMUMAN
app.post('/api/pengumuman', async (req, res) => {
  try {
    const { judul, isi, tipe } = req.body;
    const { data: inserted, error } = await supabase.from('pengumuman').insert([{
      judul, isi, tipe: tipe || 'info', tanggal: new Date().toISOString()
    }]).select();
    if (error) throw error;
    res.json({ success: true, data: inserted[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// ==========================================
app.get('/api/pengumuman', async (req, res) => {
  try {
    const { data: items, error } = await supabase.from('pengumuman').select('*').order('id', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


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
    const { judul, deskripsi, deadline, kelas, link_tugas } = req.body;
    const { data: inserted, error } = await supabase.from('tugas').insert([{
      judul, deskripsi, deadline, kelas: String(kelas), link_tugas
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

// Serving static frontend jika dist tersedia
const distPath = path.join(__dirname, '../client/dist');
module.exports = app;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log('Server aktif');
  });
}

