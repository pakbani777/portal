const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'pai_portal.db');
const db = new DatabaseSync(dbPath);

// Inisialisasi Skema Tabel
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL, -- 'guru' atau 'siswa'
    nama TEXT NOT NULL,
    nisn_nip TEXT,
    kelas TEXT,
    foto_profil TEXT
  );

  CREATE TABLE IF NOT EXISTS siswa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nisn TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    kelas TEXT NOT NULL,
    gender TEXT -- 'L' atau 'P'
  );

  CREATE TABLE IF NOT EXISTS materi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kelas INTEGER NOT NULL,
    bab INTEGER NOT NULL,
    judul TEXT NOT NULL,
    kategori TEXT NOT NULL,
    ayat_arab TEXT,
    arti_ayat TEXT,
    deskripsi TEXT,
    konten TEXT NOT NULL,
    rujukan TEXT,
    urutan INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS jadwal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kelas TEXT NOT NULL,
    hari TEXT NOT NULL,
    jam TEXT NOT NULL,
    ruang TEXT NOT NULL,
    guru TEXT NOT NULL,
    materi_pokok TEXT NOT NULL,
    link_pertemuan TEXT,
    status TEXT DEFAULT 'Mendatang'
  );

  CREATE TABLE IF NOT EXISTS absensi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kelas TEXT NOT NULL,
    nama_siswa TEXT NOT NULL,
    nisn TEXT,
    tanggal TEXT NOT NULL,
    status TEXT NOT NULL, -- Hadir, Sakit, Izin, Alpa
    keterangan TEXT,
    waktu TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS kuis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kelas INTEGER NOT NULL,
    bab INTEGER NOT NULL,
    judul TEXT NOT NULL,
    kategori TEXT NOT NULL,
    durasi_menit INTEGER DEFAULT 15,
    soal_json TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ulangan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kelas INTEGER NOT NULL,
    jenis TEXT NOT NULL,
    judul TEXT NOT NULL,
    durasi_menit INTEGER DEFAULT 60,
    token_ujian TEXT NOT NULL,
    soal_json TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS nilai (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipe TEXT NOT NULL,
    ref_id INTEGER NOT NULL,
    nama_siswa TEXT NOT NULL,
    kelas TEXT NOT NULL,
    skor REAL NOT NULL,
    total_soal INTEGER NOT NULL,
    jawaban_benar INTEGER NOT NULL,
    waktu_selesai TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pengumuman (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    judul TEXT NOT NULL,
    isi TEXT NOT NULL,
    tanggal TEXT NOT NULL,
    penulis TEXT NOT NULL
  );
`);

// 1. Seed Akun Pengguna (Users)
const checkUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (checkUsers.count === 0) {
  console.log('Mengisi data akun otentikasi login Guru (Pak Bani) dan Siswa...');

  const insertUser = db.prepare(`
    INSERT INTO users (username, password, role, nama, nisn_nip, kelas)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Akun Admin Guru (Pak Bani)
  insertUser.run(
    'pakbani',
    'pakbani123',
    'guru',
    'Pak Bani, S.Pd.I',
    '19870815 201201 1 009',
    'Guru Pengampu PAI'
  );

  // Akun Siswa (Ahmad Fauzi dan akun demo kelas)
  insertUser.run(
    'ahmad',
    'siswa123',
    'siswa',
    'Ahmad Fauzi',
    '0081234501',
    '7-A'
  );

  insertUser.run(
    'aisyah',
    'siswa123',
    'siswa',
    'Aisyah Putri Azzahra',
    '0081234502',
    '7-A'
  );

  insertUser.run(
    'aditya',
    'siswa123',
    'siswa',
    'Aditya Pratama Putra',
    '0071234601',
    '8-A'
  );

  insertUser.run(
    'alif',
    'siswa123',
    'siswa',
    'Alif Danuarta',
    '0061234701',
    '9-A'
  );
}

// 2. Seed Siswa jika kosong
const checkSiswa = db.prepare('SELECT COUNT(*) as count FROM siswa').get();
if (checkSiswa.count === 0) {
  console.log('Mengisi daftar siswa resmi kelas 7, 8, dan 9 untuk Portal PakBani...');

  const insertSiswa = db.prepare(`
    INSERT INTO siswa (nisn, nama, kelas, gender)
    VALUES (?, ?, ?, ?)
  `);

  // Siswa Kelas 7-A
  const siswa7A = [
    { nisn: '0081234501', nama: 'Ahmad Fauzi', gender: 'L' },
    { nisn: '0081234502', nama: 'Aisyah Putri Azzahra', gender: 'P' },
    { nisn: '0081234503', nama: 'Budi Nur Pratama', gender: 'L' },
    { nisn: '0081234504', nama: 'Dimas Anggara', gender: 'L' },
    { nisn: '0081234505', nama: 'Fatimah Az-Zahra', gender: 'P' },
    { nisn: '0081234506', nama: 'Muhammad Ridwan Habibi', gender: 'L' },
    { nisn: '0081234507', nama: 'Nabila Zahra Khairunnisa', gender: 'P' },
    { nisn: '0081234508', nama: 'Rizky Maulana Syahputra', gender: 'L' },
    { nisn: '0081234509', nama: 'Siti Rahmawati', gender: 'P' },
    { nisn: '0081234510', nama: 'Yusuf Al-Bukhari', gender: 'L' },
  ];
  siswa7A.forEach(s => insertSiswa.run(s.nisn, s.nama, '7-A', s.gender));

  // Siswa Kelas 8-A
  const siswa8A = [
    { nisn: '0071234601', nama: 'Aditya Pratama Putra', gender: 'L' },
    { nisn: '0071234602', nama: 'Annisa Nurul Hidayah', gender: 'P' },
    { nisn: '0071234603', nama: 'Fajar Kurniawan', gender: 'L' },
    { nisn: '0071234604', nama: 'Hafizhah Humaira', gender: 'P' },
    { nisn: '0071234605', nama: 'Ihsan Kamil', gender: 'L' },
    { nisn: '0071234606', nama: 'Kayla Salsabila', gender: 'P' },
    { nisn: '0071234607', nama: 'Lukman Hakim', gender: 'L' },
    { nisn: '0071234608', nama: 'Maryam Al-Qibtiyah', gender: 'P' },
    { nisn: '0071234609', nama: 'Raihan Ramadhan', gender: 'L' },
    { nisn: '0071234610', nama: 'Zaskia Adya', gender: 'P' },
  ];
  siswa8A.forEach(s => insertSiswa.run(s.nisn, s.nama, '8-A', s.gender));

  // Siswa Kelas 9-A
  const siswa9A = [
    { nisn: '0061234701', nama: 'Alif Danuarta', gender: 'L' },
    { nisn: '0061234702', nama: 'Bilqis Maharani', gender: 'P' },
    { nisn: '0061234703', nama: 'Farhan Maulana', gender: 'L' },
    { nisn: '0061234704', nama: 'Ghaida Tsurayya', gender: 'P' },
    { nisn: '0061234705', nama: 'Haikal Rabbani', gender: 'L' },
    { nisn: '0061234706', nama: 'Intan Permatasari', gender: 'P' },
    { nisn: '0061234707', nama: 'Kaisar Ali', gender: 'L' },
    { nisn: '0061234708', nama: 'Lutfiah Rahmani', gender: 'P' },
    { nisn: '0061234709', nama: 'Naufal Izzaturrahman', gender: 'L' },
    { nisn: '0061234710', nama: 'Zahrotul Jannah', gender: 'P' },
  ];
  siswa9A.forEach(s => insertSiswa.run(s.nisn, s.nama, '9-A', s.gender));
}

// 3. Update Nama Guru di Jadwal & Pengumuman ke "Pak Bani, S.Pd.I"
db.exec(`
  UPDATE jadwal SET guru = 'Pak Bani, S.Pd.I';
  UPDATE pengumuman SET penulis = 'Pak Bani, S.Pd.I';
`);

module.exports = db;
