# 🌟 Portal PakBani (SMP/MTs)
### Media Pembelajaran Digital Terpadu PAI & Budi Pekerti • Kelas 7, 8, dan 9
**Pengampu: Pak Bani, S.Pd.I**

Aplikasi web portal edukasi terpadu untuk mata pelajaran **Pendidikan Agama Islam (PAI) & Budi Pekerti** jenjang **SMP/MTs (Kelas VII, VIII, dan IX)**. Menggabungkan antarmuka modern yang ramah pengguna smartphone (*mobile-friendly*) dengan sistem backend terintegrasi, database SQLite lokal, dan pengelolaan presensi bulanan resmi oleh guru (Pak Bani).

---

## 📱 Fitur Utama Aplikasi

1. **Brand & Identitas Baru: Portal PakBani**:
   - Nuansa Islami sejuk (*emerald green* dan sentuhan *gold*).
   - Pengampu resmi KBM: **Pak Bani, S.Pd.I**.

2. **Presensi Siswa Bulanan Khusus Diisi oleh Guru (Pak Bani)**:
   - **Mode Siswa**:
     - Bersifat informatif (*read-only*). Siswa tidak dapat mengisi atau mengubah presensi sendiri.
     - Menampilkan kartu ringkasan kehadiran siswa pribadi bulan tersebut (Total Hadir, Sakit, Izin, Alpa, dan % Kehadiran).
     - Menampilkan matriks rekap kehadiran kelas dan tombol **Export CSV**.
   - **Mode Guru (Pak Bani)**:
     - Tab **Rekap Matriks Bulanan**: Tabel kalender bulanan seluruh siswa di kelas dengan indikator H (Hadir), S (Sakit), I (Izin), A (Alpa).
     - Tab **+ Input Presensi Tanggal**: Pak Bani dapat memilih tanggal KBM, klik tombol cepat *"Tandai Semua Hadir"*, mengubah status per siswa dengan satu klik, menambahkan catatan keterangan, dan menyimpan presensi seluruh kelas sekaligus.
     - Tombol **Export CSV Bulanan** untuk pelaporan resmi administrasi sekolah ke Excel.

3. **Modul Materi Pembelajaran (Kelas 7, 8, dan 9)**:
   - 15 Bab materi resmi kurikulum SMP/MTs lengkap dengan potongan ayat Al-Qur'an/Hadis berharakat (*font Amiri*), terjemahan, kontrol ukuran huruf, dan status tuntas baca.

4. **Jadwal Pelajaran KBM**:
   - Filter per kelas dan hari, penanda sesi aktif **LIVE**, tautan ruang virtual (Google Meet / Zoom).

5. **Kuis Interaktif & Ulangan Online CBT**:
   - Kuis latihan interaktif per bab dengan audio synth dan pembahasan soal.
   - Ulangan CBT dengan token ujian (contoh token: `PAI7PTS`, `PAI8PTS`, `PAI9PTS`), navigasi nomor ragu-ragu/terjawab, countdown timer, dan sertifikat nilai digital.

6. **Switch Role Cepat**:
   - Tombol toggle di header untuk berganti antara **Mode Siswa** (*Ahmad Fauzi*) dan **Mode Guru** (*Pak Bani, S.Pd.I*).

---

## 🚀 Cara Menjalankan Aplikasi

Cukup klik dua kali file:
```text
Jalankan_Portal_PAI.bat
```
Atau via terminal:
```bash
node server/index.js
```
Lalu buka browser di: **`http://localhost:5000`**
