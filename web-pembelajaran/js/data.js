// ============================================
// DATA.JS - Data aplikasi E-Learning PAI
// ============================================

const APP_DATA = {

  // ========== GURU ==========
  guru: [
    {
      id: 'g001',
      nama: 'Drs. Ahmad Fauzi, M.Pd.I',
      title: 'Guru PAI Senior',
      kelas: 'Wali Kelas 7A & 7B',
      pendidikan: 'S2 Pendidikan Agama Islam - UIN Jakarta',
      pengalaman: '18 Tahun',
      icon: '👨‍🏫',
      nip: 'guru001',
      password: 'guru123',
      bio: 'Berpengalaman mengajar PAI dengan metode inovatif berbasis IT.',
      mataPelajaran: ['Aqidah', 'Akhlak', 'Al-Quran Hadits']
    },
    {
      id: 'g002',
      nama: 'Hj. Siti Nurjannah, S.Pd.I',
      title: 'Guru PAI Kelas 8',
      kelas: 'Wali Kelas 8A',
      pendidikan: 'S1 Pendidikan Islam - IAIN Bandung',
      pengalaman: '12 Tahun',
      icon: '👩‍🏫',
      nip: 'guru002',
      password: 'guru123',
      bio: 'Spesialis pengembangan metode pembelajaran Al-Quran interaktif.',
      mataPelajaran: ['Fiqih', 'Al-Quran', 'Sejarah Islam']
    },
    {
      id: 'g003',
      nama: 'Muhammad Rizky, S.Pd.I',
      title: 'Guru PAI Kelas 9',
      kelas: 'Wali Kelas 9B',
      pendidikan: 'S1 Pendidikan Agama Islam - UMY',
      pengalaman: '8 Tahun',
      icon: '👨‍🏫',
      nip: 'guru003',
      password: 'guru123',
      bio: 'Aktif dalam pengembangan kurikulum PAI berbasis teknologi digital.',
      mataPelajaran: ['Aqidah', 'Fiqih', 'SKI']
    }
  ],

  // ========== INFORMASI TERKINI ==========
  informasi: [
    {
      id: 'i001',
      judul: 'Ujian CBT Semester Ganjil Dimulai 15 Oktober 2026',
      isi: 'Seluruh siswa kelas 7, 8, dan 9 diwajibkan mengikuti Ujian CBT Semester Ganjil yang akan dilaksanakan mulai tanggal 15 Oktober 2026. Pastikan perangkat sudah siap.',
      kategori: 'Ujian',
      icon: '📝',
      tanggal: '7 Oktober 2026',
      penting: true
    },
    {
      id: 'i002',
      judul: 'Materi Baru: Akhlak Mulia dalam Kehidupan Sehari-hari',
      isi: 'Materi baru untuk kelas 8 telah ditambahkan. Silakan akses di menu Materi Pembelajaran. Materi mencakup contoh nyata akhlak terpuji dalam lingkungan sekolah.',
      kategori: 'Materi',
      icon: '📚',
      tanggal: '5 Oktober 2026',
      penting: false
    },
    {
      id: 'i003',
      judul: 'Pengumpulan Tugas Kelas 9 Diperpanjang',
      isi: 'Deadline pengumpulan tugas Materi Fiqih untuk kelas 9 diperpanjang hingga 10 Oktober 2026 pukul 23.59 WIB. Segera kumpulkan tugas Anda.',
      kategori: 'Tugas',
      icon: '📤',
      tanggal: '4 Oktober 2026',
      penting: true
    },
    {
      id: 'i004',
      judul: 'Kegiatan Tahfidz Quran Setiap Jumat Pagi',
      isi: 'Program Tahfidz Quran dilaksanakan setiap hari Jumat pukul 06.30 - 07.30 WIB. Semua siswa wajib hadir membawa Al-Quran masing-masing.',
      kategori: 'Kegiatan',
      icon: '🕌',
      tanggal: '3 Oktober 2026',
      penting: false
    },
    {
      id: 'i005',
      judul: 'Nilai Ujian Tengah Semester Sudah Bisa Dilihat',
      isi: 'Nilai UTS telah diinput oleh masing-masing guru. Siswa dapat melihat nilai mereka melalui menu Hasil Nilai di dashboard masing-masing.',
      kategori: 'Nilai',
      icon: '📊',
      tanggal: '1 Oktober 2026',
      penting: false
    },
    {
      id: 'i006',
      judul: 'Pelatihan Digital Literacy untuk Orang Tua Siswa',
      isi: 'Sekolah mengadakan pelatihan penggunaan platform E-Learning PAI untuk orang tua siswa pada Sabtu, 12 Oktober 2026 pukul 09.00 WIB di Aula Sekolah.',
      kategori: 'Kegiatan',
      icon: '👨‍👩‍👧',
      tanggal: '29 September 2026',
      penting: false
    }
  ],

  // ========== SISWA DEMO ==========
  siswa: {
    '123456': { nama: 'Ahmad Rizki Pratama', kelas: '7', kelasDetail: '7A', absensi: { hadir: 45, sakit: 2, izin: 1, alpha: 0 }, password: 'siswa123' },
    '234567': { nama: 'Siti Aisyah Ramadhani', kelas: '8', kelasDetail: '8B', absensi: { hadir: 42, sakit: 3, izin: 2, alpha: 1 }, password: 'siswa123' },
    '345678': { nama: 'Muhamad Farhan Idris', kelas: '9', kelasDetail: '9A', absensi: { hadir: 47, sakit: 1, izin: 0, alpha: 0 }, password: 'siswa123' },
  },

  // ========== MATERI PER KELAS ==========
  materi: {
    '7': [
      {
        bab: 1, judul: 'Aqidah Islam: Rukun Iman',
        deskripsi: 'Memahami enam rukun iman dan implementasinya dalam kehidupan sehari-hari sebagai landasan keimanan seorang Muslim.',
        durasi: '3x pertemuan', icon: '🕌', selesai: true,
        subtopik: ['Pengertian Iman', 'Iman kepada Allah', 'Iman kepada Malaikat', 'Iman kepada Kitab', 'Iman kepada Rasul', 'Iman kepada Hari Akhir', 'Iman kepada Qada dan Qadar'],
        file: 'https://drive.google.com/example'
      },
      {
        bab: 2, judul: 'Al-Quran: Membaca dengan Tajwid',
        deskripsi: 'Mempelajari hukum bacaan tajwid dasar agar dapat membaca Al-Quran dengan benar dan indah sesuai kaidah ilmu tajwid.',
        durasi: '4x pertemuan', icon: '📖', selesai: true,
        subtopik: ['Makharijul Huruf', 'Hukum Nun Mati', 'Hukum Mim Mati', 'Mad dan Qashr', 'Idgham dan Ikhfa'],
        file: 'https://drive.google.com/example'
      },
      {
        bab: 3, judul: 'Akhlak: Adab kepada Orang Tua',
        deskripsi: 'Memahami pentingnya berbakti kepada orang tua sebagai kewajiban seorang Muslim berdasarkan dalil Al-Quran dan Hadits.',
        durasi: '2x pertemuan', icon: '❤️', selesai: true,
        subtopik: ['Pengertian Birrul Walidain', 'Cara Berbakti kepada Orang Tua', 'Contoh Perilaku Terpuji', 'Kisah Teladan'],
        file: 'https://drive.google.com/example'
      },
      {
        bab: 4, judul: 'Fiqih: Thaharah (Bersuci)',
        deskripsi: 'Mempelajari cara bersuci yang benar dalam Islam, meliputi wudhu, tayammum, dan mandi wajib sesuai syariat.',
        durasi: '3x pertemuan', icon: '💧', selesai: false,
        subtopik: ['Pengertian Thaharah', 'Najis dan Cara Menyucikan', 'Wudhu', 'Tayammum', 'Mandi Wajib'],
        file: 'https://drive.google.com/example'
      },
      {
        bab: 5, judul: 'Sejarah Islam: Masa Nabi Muhammad SAW',
        deskripsi: 'Mengenal perjalanan hidup Nabi Muhammad SAW dari kelahiran hingga masa kenabian sebagai suri tauladan umat Islam.',
        durasi: '3x pertemuan', icon: '🌙', selesai: false,
        subtopik: ['Kelahiran Nabi', 'Masa Kanak-kanak', 'Periode Makkah', 'Hijrah ke Madinah', 'Fathu Makkah'],
        file: 'https://drive.google.com/example'
      }
    ],
    '8': [
      {
        bab: 1, judul: 'Aqidah: Asmaul Husna',
        deskripsi: 'Memahami 10 Asmaul Husna utama beserta makna dan pengaruhnya terhadap perilaku Muslim dalam kehidupan.',
        durasi: '4x pertemuan', icon: '✨', selesai: true,
        subtopik: ['Ar-Rahman', 'Ar-Rahim', 'Al-Malik', 'Al-Quddus', 'As-Salam', 'Al-Mu\'min', 'Al-Muhaimin', 'Al-Aziz', 'Al-Jabbar', 'Al-Mutakabbir'],
        file: 'https://drive.google.com/example'
      },
      {
        bab: 2, judul: 'Al-Quran Hadits: QS. Al-Mujadilah dan Al-Jumuah',
        deskripsi: 'Mengkaji ayat-ayat Al-Quran tentang keutamaan menuntut ilmu dan cara mengamalkannya dalam kehidupan modern.',
        durasi: '3x pertemuan', icon: '📖', selesai: true,
        subtopik: ['Tilawah QS Al-Mujadilah', 'Tilawah QS Al-Jumuah', 'Tafsir dan Kandungan', 'Asbabun Nuzul', 'Penerapan dalam Kehidupan'],
        file: 'https://drive.google.com/example'
      },
      {
        bab: 3, judul: 'Akhlak: Perilaku Terpuji dalam Pergaulan',
        deskripsi: 'Membangun akhlak mulia dalam pergaulan sehari-hari di lingkungan sekolah dan masyarakat berdasarkan ajaran Islam.',
        durasi: '2x pertemuan', icon: '🤝', selesai: true,
        subtopik: ['Jujur dan Amanah', 'Menghormati yang Lebih Tua', 'Tolong-menolong', 'Menjauhi Pergaulan Bebas'],
        file: 'https://drive.google.com/example'
      },
      {
        bab: 4, judul: 'Fiqih: Shalat Berjamaah dan Shalat Jum\'at',
        deskripsi: 'Memahami tata cara, syarat, dan keutamaan shalat berjamaah serta shalat Jumat sebagai ibadah wajib umat Islam.',
        durasi: '4x pertemuan', icon: '🕌', selesai: false,
        subtopik: ['Hukum Shalat Berjamaah', 'Syarat dan Tata Cara', 'Keutamaan Berjamaah', 'Shalat Jumat', 'Khutbah Jumat'],
        file: 'https://drive.google.com/example'
      },
      {
        bab: 5, judul: 'SKI: Perkembangan Islam di Nusantara',
        deskripsi: 'Mempelajari sejarah masuknya Islam ke Nusantara dan perkembangannya melalui jalur perdagangan, pernikahan, dan pendidikan.',
        durasi: '3x pertemuan', icon: '🌍', selesai: false,
        subtopik: ['Teori Masuknya Islam', 'Wali Songo', 'Kerajaan Islam di Nusantara', 'Peran Pesantren'],
        file: 'https://drive.google.com/example'
      }
    ],
    '9': [
      {
        bab: 1, judul: 'Aqidah: Iman kepada Hari Akhir',
        deskripsi: 'Memahami tanda-tanda kiamat, alam barzakh, dan tahapan kehidupan akhirat sebagai motivasi untuk beramal shalih.',
        durasi: '4x pertemuan', icon: '🌟', selesai: true,
        subtopik: ['Tanda-tanda Kiamat', 'Alam Barzakh', 'Yaumul Hasyr', 'Mizan dan Hisab', 'Surga dan Neraka'],
        file: 'https://drive.google.com/example'
      },
      {
        bab: 2, judul: 'Al-Quran: QS. Luqman dan QS. Al-Baqarah',
        deskripsi: 'Mengkaji nasihat Luqman kepada anaknya sebagai pedoman mendidik generasi Muslim yang berkarakter.',
        durasi: '4x pertemuan', icon: '📖', selesai: true,
        subtopik: ['Tilawah dan Tajwid', 'Kisah Luqman', 'Nasihat kepada Anak', 'Ayat-ayat Motivasi', 'Implementasi Praktis'],
        file: 'https://drive.google.com/example'
      },
      {
        bab: 3, judul: 'Akhlak: Menghindari Sikap Tercela',
        deskripsi: 'Memahami bahaya sifat-sifat tercela seperti hasad, gibah, namimah, dan cara menghindarinya dalam kehidupan sosial.',
        durasi: '3x pertemuan', icon: '⚠️', selesai: true,
        subtopik: ['Pengertian Akhlak Tercela', 'Hasad (Dengki)', 'Gibah (Bergunjing)', 'Namimah (Adu Domba)', 'Cara Menjauhi Sifat Tercela'],
        file: 'https://drive.google.com/example'
      },
      {
        bab: 4, judul: 'Fiqih: Zakat, Infaq, dan Sedekah',
        deskripsi: 'Mempelajari ketentuan zakat fitrah dan zakat mal, serta hikmah berinfaq dan bersedekah dalam Islam.',
        durasi: '4x pertemuan', icon: '💰', selesai: false,
        subtopik: ['Zakat Fitrah', 'Zakat Mal dan Nisabnya', 'Mustahiq Zakat', 'Infaq dan Sedekah', 'Hikmah Zakat'],
        file: 'https://drive.google.com/example'
      },
      {
        bab: 5, judul: 'SKI: Perkembangan Islam di Dunia Modern',
        deskripsi: 'Mengkaji peran Islam dalam peradaban dunia dan tantangan umat Islam di era modern dan globalisasi.',
        durasi: '3x pertemuan', icon: '🌐', selesai: false,
        subtopik: ['Islam dan Peradaban', 'Tokoh Muslim Dunia', 'Islam di Eropa dan Amerika', 'Tantangan Islam Modern', 'Solusi Islami'],
        file: 'https://drive.google.com/example'
      }
    ]
  },

  // ========== SOAL UJIAN CBT ==========
  soalCBT: {
    '7': [
      {
        soal: 'Rukun Iman terdiri dari berapa bagian?',
        pilihan: ['4', '5', '6', '7'],
        jawaban: 2
      },
      {
        soal: 'Iman kepada Allah berarti...',
        pilihan: [
          'Mempercayai bahwa Allah itu ada',
          'Hanya mengucapkan kalimat syahadat',
          'Melaksanakan shalat 5 waktu',
          'Membaca Al-Quran setiap hari'
        ],
        jawaban: 0
      },
      {
        soal: 'Malaikat yang bertugas menyampaikan wahyu kepada Nabi adalah...',
        pilihan: ['Mikail', 'Jibril', 'Izrail', 'Israfil'],
        jawaban: 1
      },
      {
        soal: 'Kitab suci yang diturunkan kepada Nabi Musa AS adalah...',
        pilihan: ['Injil', 'Zabur', 'Taurat', 'Al-Quran'],
        jawaban: 2
      },
      {
        soal: 'Nabi pertama yang diutus Allah SWT adalah...',
        pilihan: ['Nabi Ibrahim AS', 'Nabi Adam AS', 'Nabi Musa AS', 'Nabi Isa AS'],
        jawaban: 1
      },
      {
        soal: 'Hukum bacaan yang mewajibkan dengung 2 harakat disebut...',
        pilihan: ['Ikhfa', 'Idgham Bighunnah', 'Izhar', 'Iqlab'],
        jawaban: 1
      },
      {
        soal: '"Wa bil walidaini ihsana" artinya adalah...',
        pilihan: [
          'Dan berbuat baiklah kepada teman',
          'Dan berbuat baiklah kepada kedua orang tua',
          'Dan berbuat baiklah kepada guru',
          'Dan berbuat baiklah kepada sesama'
        ],
        jawaban: 1
      },
      {
        soal: 'Yang termasuk najis mughallazhah adalah...',
        pilihan: ['Air kencing anjing', 'Kotoran anjing', 'Jilatan anjing', 'Bulu anjing'],
        jawaban: 2
      },
      {
        soal: 'Nabi Muhammad SAW lahir di kota...',
        pilihan: ['Madinah', 'Mekkah', 'Taif', 'Yaman'],
        jawaban: 1
      },
      {
        soal: 'Peristiwa hijrahnya Nabi Muhammad SAW terjadi pada tahun...',
        pilihan: ['620 M', '621 M', '622 M', '623 M'],
        jawaban: 2
      }
    ],
    '8': [
      {
        soal: 'Asmaul Husna yang berarti "Maha Pengasih" adalah...',
        pilihan: ['Ar-Rahim', 'Ar-Rahman', 'Al-Malik', 'Al-Quddus'],
        jawaban: 1
      },
      {
        soal: 'QS. Al-Mujadilah ayat 11 menjelaskan tentang keutamaan...',
        pilihan: ['Shalat', 'Menuntut Ilmu', 'Puasa', 'Zakat'],
        jawaban: 1
      },
      {
        soal: 'Perilaku jujur dalam Islam disebut...',
        pilihan: ['Amanah', 'Sidiq', 'Tabligh', 'Fathonah'],
        jawaban: 1
      },
      {
        soal: 'Syarat sah shalat Jumat adalah adanya...',
        pilihan: ['10 orang', '20 orang', '40 orang', '100 orang'],
        jawaban: 2
      },
      {
        soal: 'Wali Songo yang menyebarkan Islam di Tuban adalah...',
        pilihan: ['Sunan Giri', 'Sunan Bonang', 'Sunan Kalijaga', 'Sunan Kudus'],
        jawaban: 1
      },
      {
        soal: 'Al-Muhaimin berarti...',
        pilihan: ['Maha Perkasa', 'Maha Memelihara', 'Maha Mengetahui', 'Maha Bijaksana'],
        jawaban: 1
      },
      {
        soal: 'Masuknya Islam ke Nusantara melalui jalur...',
        pilihan: ['Perang', 'Perdagangan', 'Politik', 'Kebudayaan saja'],
        jawaban: 1
      },
      {
        soal: 'Shalat berjamaah lebih utama dari shalat sendirian dengan pahala...',
        pilihan: ['10 derajat', '17 derajat', '27 derajat', '30 derajat'],
        jawaban: 2
      },
      {
        soal: 'Asbabun Nuzul artinya...',
        pilihan: [
          'Penafsiran ayat Al-Quran',
          'Sebab-sebab turunnya ayat Al-Quran',
          'Terjemahan Al-Quran',
          'Ilmu membaca Al-Quran'
        ],
        jawaban: 1
      },
      {
        soal: 'Sifat hasad berarti...',
        pilihan: ['Kikir', 'Dengki', 'Sombong', 'Malas'],
        jawaban: 1
      }
    ],
    '9': [
      {
        soal: 'Alam setelah manusia meninggal dunia dan sebelum hari kiamat disebut...',
        pilihan: ['Alam Ruh', 'Alam Barzakh', 'Alam Mahsyar', 'Alam Akhirat'],
        jawaban: 1
      },
      {
        soal: 'Nasihat Luqman kepada anaknya terdapat dalam Al-Quran surah...',
        pilihan: ['QS. Luqman ayat 12-19', 'QS. Luqman ayat 1-10', 'QS. Ibrahim ayat 1-7', 'QS. Yusuf ayat 1-5'],
        jawaban: 0
      },
      {
        soal: 'Bergunjing atau membicarakan keburukan orang lain disebut...',
        pilihan: ['Hasad', 'Namimah', 'Gibah', 'Riya'],
        jawaban: 2
      },
      {
        soal: 'Nisab zakat emas adalah...',
        pilihan: ['65 gram', '85 gram', '93,6 gram', '100 gram'],
        jawaban: 2
      },
      {
        soal: 'Orang yang berhak menerima zakat disebut...',
        pilihan: ['Muzakki', 'Mustahiq', 'Amil', 'Wakil'],
        jawaban: 1
      },
      {
        soal: 'Tanda-tanda kiamat yang sudah terjadi disebut tanda kiamat...',
        pilihan: ['Kubra', 'Sughra', 'Wushtha', 'Besar'],
        jawaban: 1
      },
      {
        soal: 'Tokoh Muslim yang menemukan algoritma matematika adalah...',
        pilihan: ['Al-Kindi', 'Al-Khwarizmi', 'Ibnu Sina', 'Al-Biruni'],
        jawaban: 1
      },
      {
        soal: 'Bersedekah dapat menolak...',
        pilihan: ['Kefakiran', 'Bala dan musibah', 'Kesuksesan', 'Kekayaan'],
        jawaban: 1
      },
      {
        soal: 'Namimah artinya...',
        pilihan: ['Berbohong', 'Adu domba', 'Mencuri', 'Bergunjing'],
        jawaban: 1
      },
      {
        soal: 'Jumlah mustahiq zakat yang disebutkan dalam Al-Quran adalah...',
        pilihan: ['6 golongan', '7 golongan', '8 golongan', '10 golongan'],
        jawaban: 2
      }
    ]
  },

  // ========== NILAI SISWA ==========
  nilai: {
    '123456': [
      { matpel: 'Aqidah Akhlak', uh1: 85, uh2: 88, uts: 82, uas: null },
      { matpel: 'Al-Quran Hadits', uh1: 90, uh2: 87, uts: 86, uas: null },
      { matpel: 'Fiqih', uh1: 78, uh2: 82, uts: 80, uas: null },
      { matpel: 'SKI', uh1: 88, uh2: 90, uts: 85, uas: null },
    ],
    '234567': [
      { matpel: 'Aqidah Akhlak', uh1: 82, uh2: 85, uts: 88, uas: null },
      { matpel: 'Al-Quran Hadits', uh1: 88, uh2: 90, uts: 91, uas: null },
      { matpel: 'Fiqih', uh1: 75, uh2: 80, uts: 83, uas: null },
      { matpel: 'SKI', uh1: 85, uh2: 87, uts: 84, uas: null },
    ],
    '345678': [
      { matpel: 'Aqidah Akhlak', uh1: 90, uh2: 92, uts: 89, uas: null },
      { matpel: 'Al-Quran Hadits', uh1: 87, uh2: 89, uts: 90, uas: null },
      { matpel: 'Fiqih', uh1: 83, uh2: 86, uts: 88, uas: null },
      { matpel: 'SKI', uh1: 91, uh2: 88, uts: 87, uas: null },
    ]
  },

  // ========== TUGAS ==========
  tugas: {
    '7': [
      { id: 't7-1', judul: 'Menulis Doa Sehari-hari', matpel: 'Aqidah Akhlak', deadline: '10 Oktober 2026', link: 'https://forms.google.com', status: 'Belum Dikumpul', ket: 'Tulis minimal 10 doa beserta artinya' },
      { id: 't7-2', judul: 'Hafalan Surat Al-Ikhlas & Al-Falaq', matpel: 'Al-Quran Hadits', deadline: '12 Oktober 2026', link: 'https://forms.google.com', status: 'Sudah Dikumpul', ket: 'Kirim video rekaman hafalan' },
      { id: 't7-3', judul: 'Resume Cara Berwudhu', matpel: 'Fiqih', deadline: '15 Oktober 2026', link: 'https://forms.google.com', status: 'Belum Dikumpul', ket: 'Tuliskan tata cara wudhu lengkap dengan niatnya' }
    ],
    '8': [
      { id: 't8-1', judul: 'Presentasi Asmaul Husna', matpel: 'Aqidah Akhlak', deadline: '10 Oktober 2026', link: 'https://forms.google.com', status: 'Sudah Dikumpul', ket: 'Buat materi presentasi 5 Asmaul Husna' },
      { id: 't8-2', judul: 'Analisis Hadits Menuntut Ilmu', matpel: 'Al-Quran Hadits', deadline: '13 Oktober 2026', link: 'https://forms.google.com', status: 'Belum Dikumpul', ket: 'Analisis makna dan relevansi hadits kekinian' },
      { id: 't8-3', judul: 'Laporan Kunjungan Masjid Bersejarah', matpel: 'SKI', deadline: '16 Oktober 2026', link: 'https://forms.google.com', status: 'Belum Dikumpul', ket: 'Laporan min 2 halaman dilengkapi foto' }
    ],
    '9': [
      { id: 't9-1', judul: 'Makalah Zakat dalam Islam Modern', matpel: 'Fiqih', deadline: '10 Oktober 2026', link: 'https://forms.google.com', status: 'Belum Dikumpul', ket: 'Makalah 5-7 halaman dengan daftar pustaka' },
      { id: 't9-2', judul: 'Refleksi Nasihat Luqman', matpel: 'Al-Quran Hadits', deadline: '12 Oktober 2026', link: 'https://forms.google.com', status: 'Sudah Dikumpul', ket: 'Tulis refleksi pribadi 1-2 halaman' },
      { id: 't9-3', judul: 'Essay: Peran Muslim di Era Digital', matpel: 'Akhlak', deadline: '17 Oktober 2026', link: 'https://forms.google.com', status: 'Belum Dikumpul', ket: 'Essay 3 halaman dengan perspektif Islam' }
    ]
  },

  // ========== DATA SEMUA SISWA (untuk guru) ==========
  semuaSiswa: [
    { nisn: '123456', nama: 'Ahmad Rizki Pratama', kelas: '7A', rataRata: 84.6, absensi: 95 },
    { nisn: '111111', nama: 'Bunga Lestari', kelas: '7A', rataRata: 88.2, absensi: 97 },
    { nisn: '222222', nama: 'Dian Prastiwi', kelas: '7B', rataRata: 76.5, absensi: 90 },
    { nisn: '234567', nama: 'Siti Aisyah Ramadhani', kelas: '8B', rataRata: 85.8, absensi: 93 },
    { nisn: '333333', nama: 'Fajar Nugroho', kelas: '8A', rataRata: 79.3, absensi: 88 },
    { nisn: '444444', nama: 'Gita Safitri', kelas: '8A', rataRata: 91.0, absensi: 98 },
    { nisn: '345678', nama: 'Muhamad Farhan Idris', kelas: '9A', rataRata: 88.8, absensi: 98 },
    { nisn: '555555', nama: 'Hani Pertiwi', kelas: '9B', rataRata: 82.4, absensi: 94 },
    { nisn: '666666', nama: 'Irfan Maulana', kelas: '9A', rataRata: 77.9, absensi: 87 },
  ]
};
