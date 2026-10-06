const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logging middleware sederhana
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const multer = require('multer');
const fs = require('fs');

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, 'public/uploads');
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
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username / NISN dan Kata Sandi wajib diisi' });
    }

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Cek di database users
    let user = db.prepare(`
      SELECT * FROM users 
      WHERE (LOWER(username) = ? OR nisn_nip = ?) 
      AND password = ?
    `).get(cleanUser, username.trim(), cleanPass);

    // Fallback autentikasi jika user login dengan NISN dari tabel siswa
    if (!user) {
      const siswa = db.prepare('SELECT * FROM siswa WHERE nisn = ? OR LOWER(nama) LIKE ?').get(username.trim(), `%${cleanUser}%`);
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
app.post('/api/users/profile', upload.single('foto'), (req, res) => {
  try {
    const { id, nama, username, password } = req.body;
    if (!id || !nama || !username) {
      return res.status(400).json({ success: false, message: 'ID, Nama, dan Username wajib diisi' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

    let foto_profil = user.foto_profil;
    if (req.file) {
      // Return absolute URL relative to host, e.g. /public/uploads/...
      foto_profil = `/public/uploads/${req.file.filename}`;
    }

    if (password && password.trim() !== '') {
      db.prepare('UPDATE users SET nama = ?, username = ?, password = ?, foto_profil = ? WHERE id = ?')
        .run(nama, username, password.trim(), foto_profil, id);
    } else {
      db.prepare('UPDATE users SET nama = ?, username = ?, foto_profil = ? WHERE id = ?')
        .run(nama, username, foto_profil, id);
    }
    
    const updatedUser = db.prepare('SELECT id, username, role, nama, nisn_nip, kelas, foto_profil FROM users WHERE id = ?').get(id);

    res.json({ success: true, message: 'Profil berhasil diperbarui', data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 1C. MANAJEMEN PENGGUNA (Oleh Admin/Guru)
// ==========================================
app.get('/api/users', (req, res) => {
  try {
    const items = db.prepare('SELECT id, username, role, nama, nisn_nip, kelas, foto_profil FROM users ORDER BY role ASC, nama ASC').all();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/users', (req, res) => {
  try {
    const { username, password, role, nama, nisn_nip, kelas, gender } = req.body;
    if (!username || !password || !nama || !role) {
      return res.status(400).json({ success: false, message: 'Username, Password, Nama, dan Role wajib diisi' });
    }

    // Check existing username
    const exist = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (exist) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan' });
    }

    const insertUser = db.prepare(`
      INSERT INTO users (username, password, role, nama, nisn_nip, kelas)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    // Gunakan transaction untuk memastikan integritas (opsional, tapi disarankan)
    const transaction = db.transaction(() => {
      insertUser.run(username, password, role, nama, nisn_nip || '', kelas || '');
      
      // Jika role adalah siswa, tambahkan juga ke tabel siswa agar masuk ke daftar absensi/nilai resmi
      if (role === 'siswa' && nisn_nip && kelas) {
        // Cek dulu apakah NISN sudah ada di tabel siswa
        const existSiswa = db.prepare('SELECT id FROM siswa WHERE nisn = ?').get(nisn_nip);
        if (!existSiswa) {
          db.prepare('INSERT INTO siswa (nisn, nama, kelas, gender) VALUES (?, ?, ?, ?)')
            .run(nisn_nip, nama, kelas, gender || 'L');
        }
      }
    });
    
    transaction();

    res.json({ success: true, message: 'Pengguna baru berhasil ditambahkan' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/:id/password', (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    if (!password || password.trim() === '') {
      return res.status(400).json({ success: false, message: 'Password baru tidak boleh kosong' });
    }

    const update = db.prepare('UPDATE users SET password = ? WHERE id = ?');
    const result = update.run(password, id);

    if (result.changes === 0) {
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
app.get('/api/siswa', (req, res) => {
  try {
    const { kelas } = req.query;
    let query = 'SELECT * FROM siswa';
    const params = [];
    if (kelas && kelas !== 'all') {
      query += ' WHERE kelas LIKE ?';
      params.push(`${kelas}%`);
    }
    query += ' ORDER BY nama ASC';
    const items = db.prepare(query).all(...params);
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. STATS & DASHBOARD
// ==========================================
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const kelas = req.query.kelas || '7';
    const namaSiswa = req.query.nama || 'Ahmad Fauzi';

    const totalMateri = db.prepare('SELECT COUNT(*) as count FROM materi WHERE kelas = ?').get(kelas).count;
    const totalJadwal = db.prepare('SELECT COUNT(*) as count FROM jadwal WHERE kelas LIKE ?').get(`${kelas}%`).count;
    const totalKuis = db.prepare('SELECT COUNT(*) as count FROM kuis WHERE kelas = ?').get(kelas).count;
    const totalUlangan = db.prepare('SELECT COUNT(*) as count FROM ulangan WHERE kelas = ?').get(kelas).count;

    // Hitung kehadiran siswa
    const kehadiran = db.prepare('SELECT status, COUNT(*) as count FROM absensi WHERE nama_siswa = ? GROUP BY status').all(namaSiswa);
    const totalAbsen = kehadiran.reduce((acc, curr) => acc + curr.count, 0);
    const totalHadir = (kehadiran.find(k => k.status === 'Hadir') || { count: 0 }).count;
    const persentaseKehadiran = totalAbsen > 0 ? Math.round((totalHadir / totalAbsen) * 100) : 100;

    // Nilai rata-rata
    const avgScore = db.prepare('SELECT AVG(skor) as rata FROM nilai WHERE nama_siswa = ?').get(namaSiswa).rata || 88;

    // Pengumuman terbaru dari Pak Bani
    const pengumuman = db.prepare('SELECT * FROM pengumuman ORDER BY id DESC LIMIT 3').all();

    // Jadwal hari ini / sesi aktif
    const jadwalHariIni = db.prepare('SELECT * FROM jadwal WHERE kelas LIKE ? ORDER BY id ASC LIMIT 2').all(`${kelas}%`);

    // Statistik Guru: Total siswa yang diajar & rekap kelulusan kuis
    const totalSiswaSemua = db.prepare('SELECT COUNT(*) as count FROM siswa').get().count;
    const totalNilaiUjian = db.prepare('SELECT COUNT(*) as count FROM nilai').get().count;

    res.json({
      success: true,
      data: {
        totalMateri,
        totalJadwal,
        totalKuis,
        totalUlangan,
        persentaseKehadiran,
        totalHadir,
        totalAbsen,
        rataRataNilai: Math.round(avgScore),
        jadwalHariIni,
        pengumuman,
        totalSiswaSemua,
        totalNilaiUjian
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. MODUL MATERI PEMBELAJARAN
// ==========================================
app.get('/api/materi', (req, res) => {
  try {
    const { kelas, kategori, search } = req.query;
    let query = 'SELECT * FROM materi WHERE 1=1';
    const params = [];

    if (kelas && kelas !== 'all') {
      query += ' AND kelas = ?';
      params.push(Number(kelas));
    }
    if (kategori && kategori !== 'all') {
      query += ' AND kategori = ?';
      params.push(kategori);
    }
    if (search) {
      query += ' AND (judul LIKE ? OR deskripsi LIKE ? OR konten LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY kelas ASC, bab ASC, urutan ASC';
    const items = db.prepare(query).all(...params);
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/materi/:id', (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM materi WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Materi tidak ditemukan' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/materi', (req, res) => {
  try {
    const { kelas, bab, judul, kategori, ayat_arab, arti_ayat, deskripsi, konten, rujukan } = req.body;
    if (!kelas || !bab || !judul || !konten) {
      return res.status(400).json({ success: false, message: 'Data wajib diisi (kelas, bab, judul, konten)' });
    }

    const insert = db.prepare(`
      INSERT INTO materi (kelas, bab, judul, kategori, ayat_arab, arti_ayat, deskripsi, konten, rujukan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(kelas, bab, judul, kategori || 'Umum', ayat_arab || '', arti_ayat || '', deskripsi || '', konten, rujukan || '');
    res.json({ success: true, message: 'Materi berhasil ditambahkan oleh Pak Bani' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 5. JADWAL PELAJARAN
// ==========================================
app.get('/api/jadwal', (req, res) => {
  try {
    const { kelas, hari } = req.query;
    let query = 'SELECT * FROM jadwal WHERE 1=1';
    const params = [];

    if (kelas && kelas !== 'all') {
      query += ' AND kelas LIKE ?';
      params.push(`${kelas}%`);
    }
    if (hari && hari !== 'all') {
      query += ' AND hari = ?';
      params.push(hari);
    }

    query += ' ORDER BY id ASC';
    const items = db.prepare(query).all(...params);
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 6. ABSENSI BULANAN & PENGELOLAAN GURU
// ==========================================
app.get('/api/absensi/bulanan', (req, res) => {
  try {
    const kelas = req.query.kelas || '7-A';
    const bulan = req.query.bulan || new Date().toISOString().substring(0, 7);

    const siswaList = db.prepare('SELECT * FROM siswa WHERE kelas = ? ORDER BY nama ASC').all(kelas);

    const records = db.prepare(`
      SELECT * FROM absensi 
      WHERE kelas = ? AND tanggal LIKE ?
      ORDER BY tanggal ASC, nama_siswa ASC
    `).all(kelas, `${bulan}%`);

    const tanggalSet = new Set();
    records.forEach(r => tanggalSet.add(r.tanggal));
    const tanggalList = Array.from(tanggalSet).sort();

    const matrix = {};
    const rekapSiswa = {};

    siswaList.forEach(s => {
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

    records.forEach(r => {
      if (!matrix[r.nama_siswa]) {
        matrix[r.nama_siswa] = {};
      }
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
    records.forEach(r => {
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
        daftarSiswa: siswaList,
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

app.post('/api/absensi/batch', (req, res) => {
  try {
    const { kelas, tanggal, listAbsensi } = req.body;
    if (!kelas || !tanggal || !Array.isArray(listAbsensi)) {
      return res.status(400).json({ success: false, message: 'Format data presensi tidak lengkap' });
    }

    const waktu = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const checkExist = db.prepare('SELECT id FROM absensi WHERE kelas = ? AND tanggal = ? AND nama_siswa = ?');
    const updateStmt = db.prepare('UPDATE absensi SET status = ?, keterangan = ?, waktu = ? WHERE id = ?');
    const insertStmt = db.prepare(`
      INSERT INTO absensi (kelas, nama_siswa, nisn, tanggal, status, keterangan, waktu)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    listAbsensi.forEach(item => {
      const exist = checkExist.get(kelas, tanggal, item.nama_siswa);
      if (exist) {
        updateStmt.run(item.status, item.keterangan || (item.status === 'Hadir' ? 'Hadir di kelas' : item.status), waktu, exist.id);
      } else {
        insertStmt.run(kelas, item.nama_siswa, item.nisn || '', tanggal, item.status, item.keterangan || (item.status === 'Hadir' ? 'Hadir di kelas' : item.status), waktu);
      }
    });

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
app.get('/api/kuis', (req, res) => {
  try {
    const { kelas } = req.query;
    let query = 'SELECT id, kelas, bab, judul, kategori, durasi_menit FROM kuis';
    const params = [];

    if (kelas && kelas !== 'all') {
      query += ' WHERE kelas = ?';
      params.push(Number(kelas));
    }
    query += ' ORDER BY kelas ASC, bab ASC';
    const items = db.prepare(query).all(...params);

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/kuis/:id', (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM kuis WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Kuis tidak ditemukan' });

    item.soal = JSON.parse(item.soal_json);
    delete item.soal_json;
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/kuis/submit', (req, res) => {
  try {
    const { kuis_id, nama_siswa, kelas, jawaban } = req.body;
    const item = db.prepare('SELECT * FROM kuis WHERE id = ?').get(kuis_id);
    if (!item) return res.status(404).json({ success: false, message: 'Kuis tidak ditemukan' });

    const soalList = JSON.parse(item.soal_json);
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

    const insertNilai = db.prepare(`
      INSERT INTO nilai (tipe, ref_id, nama_siswa, kelas, skor, total_soal, jawaban_benar, waktu_selesai)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertNilai.run('kuis', kuis_id, nama_siswa || 'Siswa PAI', String(kelas || item.kelas), skor, totalSoal, jawabanBenar, now);

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
app.get('/api/ulangan', (req, res) => {
  try {
    const { kelas } = req.query;
    let query = 'SELECT id, kelas, jenis, judul, durasi_menit, token_ujian FROM ulangan';
    const params = [];

    if (kelas && kelas !== 'all') {
      query += ' WHERE kelas = ?';
      params.push(Number(kelas));
    }
    query += ' ORDER BY kelas ASC, id ASC';
    const items = db.prepare(query).all(...params);

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ulangan/:id', (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM ulangan WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Ulangan tidak ditemukan' });

    item.soal = JSON.parse(item.soal_json);
    delete item.soal_json;
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/ulangan/submit', (req, res) => {
  try {
    const { ulangan_id, nama_siswa, kelas, jawaban } = req.body;
    const item = db.prepare('SELECT * FROM ulangan WHERE id = ?').get(ulangan_id);
    if (!item) return res.status(404).json({ success: false, message: 'Ulangan tidak ditemukan' });

    const soalList = JSON.parse(item.soal_json);
    let jawabanBenar = 0;
    const totalSoal = soalList.length;

    const evaluasi = soalList.map((s) => {
      const userAns = jawaban[s.id] !== undefined ? jawaban[s.id] : -1;
      const isCorrect = userAns === s.kunci;
      if (isCorrect) jawabanBenar++;
      return {
        id: s.id,
        pertanyaan: s.pertanyaan,
        pilihan: s.pilihan,
        jawabanUser: userAns,
        kunciJawaban: s.kunci,
        benar: isCorrect
      };
    });

    const skor = Math.round((jawabanBenar / totalSoal) * 100);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const insertNilai = db.prepare(`
      INSERT INTO nilai (tipe, ref_id, nama_siswa, kelas, skor, total_soal, jawaban_benar, waktu_selesai)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertNilai.run('ulangan', ulangan_id, nama_siswa || 'Siswa PAI', String(kelas || item.kelas), skor, totalSoal, jawabanBenar, now);

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
app.get('/api/nilai', (req, res) => {
  try {
    const { nama, kelas } = req.query;
    let query = 'SELECT * FROM nilai WHERE 1=1';
    const params = [];

    if (nama) {
      query += ' AND nama_siswa = ?';
      params.push(nama);
    }
    if (kelas && kelas !== 'all') {
      query += ' AND kelas = ?';
      params.push(String(kelas));
    }

    query += ' ORDER BY id DESC';
    const items = db.prepare(query).all(...params);
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 10. PENGUMUMAN
// ==========================================
app.get('/api/pengumuman', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM pengumuman ORDER BY id DESC').all();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Serving static frontend jika dist tersedia
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'Endpoint API tidak ditemukan' });
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.send('Backend API Server Portal PakBani aktif pada port ' + PORT + '.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Server Portal PakBani aktif di http://localhost:${PORT}`);
  console.log(`===============================================`);
});
