-- 1. Buat Tabel Users
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  nama TEXT NOT NULL,
  nisn_nip TEXT,
  kelas TEXT,
  foto_profil TEXT
);

-- 2. Buat Tabel Siswa
CREATE TABLE IF NOT EXISTS public.siswa (
  id SERIAL PRIMARY KEY,
  nisn TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  kelas TEXT NOT NULL,
  gender TEXT
);

-- 3. Buat Tabel Materi
CREATE TABLE IF NOT EXISTS public.materi (
  id SERIAL PRIMARY KEY,
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

-- 4. Buat Tabel Jadwal
CREATE TABLE IF NOT EXISTS public.jadwal (
  id SERIAL PRIMARY KEY,
  kelas TEXT NOT NULL,
  hari TEXT NOT NULL,
  jam TEXT NOT NULL,
  ruang TEXT NOT NULL,
  guru TEXT NOT NULL,
  materi_pokok TEXT NOT NULL,
  link_pertemuan TEXT,
  status TEXT DEFAULT 'Mendatang'
);

-- 5. Buat Tabel Absensi
CREATE TABLE IF NOT EXISTS public.absensi (
  id SERIAL PRIMARY KEY,
  kelas TEXT NOT NULL,
  nama_siswa TEXT NOT NULL,
  nisn TEXT,
  tanggal TEXT NOT NULL,
  status TEXT NOT NULL,
  keterangan TEXT,
  waktu TEXT NOT NULL
);

-- 6. Buat Tabel Kuis
CREATE TABLE IF NOT EXISTS public.kuis (
  id SERIAL PRIMARY KEY,
  kelas INTEGER NOT NULL,
  bab INTEGER NOT NULL,
  judul TEXT NOT NULL,
  kategori TEXT NOT NULL,
  durasi_menit INTEGER DEFAULT 15,
  soal_json TEXT NOT NULL
);

-- 7. Buat Tabel Ulangan
CREATE TABLE IF NOT EXISTS public.ulangan (
  id SERIAL PRIMARY KEY,
  kelas INTEGER NOT NULL,
  jenis TEXT NOT NULL,
  judul TEXT NOT NULL,
  durasi_menit INTEGER DEFAULT 60,
  token_ujian TEXT NOT NULL,
  soal_json TEXT NOT NULL
);

-- 8. Buat Tabel Nilai
CREATE TABLE IF NOT EXISTS public.nilai (
  id SERIAL PRIMARY KEY,
  tipe TEXT NOT NULL,
  ref_id INTEGER NOT NULL,
  nama_siswa TEXT NOT NULL,
  kelas TEXT NOT NULL,
  skor REAL NOT NULL,
  total_soal INTEGER NOT NULL,
  jawaban_benar INTEGER NOT NULL,
  waktu_selesai TEXT NOT NULL
);

-- 9. Buat Tabel Pengumuman
CREATE TABLE IF NOT EXISTS public.pengumuman (
  id SERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  isi TEXT NOT NULL,
  tanggal TEXT NOT NULL,
  penulis TEXT NOT NULL
);

-- 10. Nonaktifkan RLS (Row Level Security) agar backend (Anon Key) bisa bebas membaca & menulis data
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.siswa DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.materi DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.jadwal DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.absensi DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.kuis DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ulangan DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.nilai DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengumuman DISABLE ROW LEVEL SECURITY;

-- 11. Masukkan Data Guru & Siswa Default
INSERT INTO public.users (username, password, role, nama, nisn_nip, kelas) VALUES
('pakbani', 'pakbani123', 'guru', 'Pak Bani, S.Pd.I', '19870815 201201 1 009', 'Guru Pengampu PAI'),
('ahmad', 'siswa123', 'siswa', 'Ahmad Fauzi', '0081234501', '7-A'),
('aisyah', 'siswa123', 'siswa', 'Aisyah Putri Azzahra', '0081234502', '7-A'),
('aditya', 'siswa123', 'siswa', 'Aditya Pratama Putra', '0071234601', '8-A'),
('alif', 'siswa123', 'siswa', 'Alif Danuarta', '0061234701', '9-A');

INSERT INTO public.siswa (nisn, nama, kelas, gender) VALUES
('0081234501', 'Ahmad Fauzi', '7-A', 'L'),
('0081234502', 'Aisyah Putri Azzahra', '7-A', 'P'),
('0081234503', 'Budi Nur Pratama', '7-A', 'L'),
('0081234504', 'Dimas Anggara', '7-A', 'L'),
('0081234505', 'Fatimah Az-Zahra', '7-A', 'P'),
('0081234506', 'Muhammad Ridwan Habibi', '7-A', 'L'),
('0081234507', 'Nabila Zahra Khairunnisa', '7-A', 'P'),
('0081234508', 'Rizky Maulana Syahputra', '7-A', 'L'),
('0081234509', 'Siti Rahmawati', '7-A', 'P'),
('0081234510', 'Yusuf Al-Bukhari', '7-A', 'L');
