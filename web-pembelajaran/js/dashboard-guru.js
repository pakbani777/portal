// ============================================
// DASHBOARD-GURU.JS v2
// ============================================

let guruUser = null;
let informasiData = [...APP_DATA.informasi];

document.addEventListener('DOMContentLoaded', () => {
  const raw = sessionStorage.getItem('user');
  if (!raw) { window.location.href = 'index.html#login'; return; }

  guruUser = JSON.parse(raw);
  if (guruUser.role !== 'guru') { window.location.href = 'index.html#login'; return; }

  initUI();
  initNav();
  initSidebar();
  updateClock();
  setInterval(updateClock, 1000);
  initForms();
});

// ============ UI INIT ============
function initUI() {
  document.getElementById('guruNama').textContent = guruUser.nama;
  document.getElementById('guruAvatar').textContent = guruUser.nama[0];
  document.getElementById('guruWelcomeName').textContent = guruUser.nama.split(' ')[0]; // Ambil kata pertama

  renderGuruStats();
  renderSiswaPreview();
  renderInfoPreview();
  renderKelasStats();
  renderSiswaTable();
  renderKelolaMateri();
  renderKelolaSoal();
  renderKelolaTugas();
  renderInfoList();
  renderRekapNilai();
  renderAbsensiGuru();
  renderGuruTable();
}

function updateClock() {
  const now = new Date();
  document.getElementById('topbarTime').textContent =
    `📅 ${now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
}

// ============ SIDEBAR NAV ============
function initNav() {
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', () => navTo(item.dataset.page));
  });
  document.getElementById('btnLogout').addEventListener('click', () => {
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
  });
}

function navTo(page) {
  document.getElementById('sidebar').classList.remove('open');
  document.querySelectorAll('.sidebar-nav-item').forEach(i =>
    i.classList.toggle('active', i.dataset.page === page)
  );
  document.querySelectorAll('.dash-page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  const titles = {
    beranda: '🏠 Dashboard Guru',
    siswa: '👨‍🎓 Data Siswa',
    materi: '📖 Kelola Materi',
    ujian: '✍️ Kelola Soal CBT',
    tugas: '📤 Kelola Tugas',
    informasi: '📢 Pengumuman',
    nilai: '📊 Rekap Nilai',
    absensi: '📅 Data Absensi',
    settings: '⚙️ Pengaturan Web'
  };
  document.getElementById('topbarTitle').textContent = titles[page] || page;

  if (page === 'materi') renderKelolaMateri();
  if (page === 'ujian')  renderKelolaSoal();
  if (page === 'tugas')  renderKelolaTugas();
}

function initSidebar() {
  const toggle  = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  toggle.addEventListener('click',  () => sidebar.classList.toggle('open'));
  overlay.addEventListener('click', () => sidebar.classList.remove('open'));
}

// ============ GURU STATS ============
function renderGuruStats() {
  const totalSiswa  = APP_DATA.semuaSiswa.length;
  const totalMateri = Object.values(APP_DATA.materi).flat().length;
  const totalSoal   = Object.values(APP_DATA.soalCBT).flat().length;
  const totalInfo   = informasiData.length;

  const stats = [
    { icon: '👨‍🎓', color: 'blue',   value: totalSiswa,  label: 'Total Siswa' },
    { icon: '📖',    color: 'green',  value: totalMateri, label: 'Total Materi' },
    { icon: '✍️',   color: 'yellow', value: totalSoal,   label: 'Total Soal CBT' },
    { icon: '📢',    color: 'purple', value: totalInfo,   label: 'Pengumuman' },
  ];

  document.getElementById('guruStats').innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-card-icon ${s.color}">${s.icon}</div>
      <div class="stat-card-body">
        <div class="stat-card-value">${s.value}</div>
        <div class="stat-card-label">${s.label}</div>
      </div>
    </div>
  `).join('');
}

// ============ SISWA PREVIEW ============
function renderSiswaPreview() {
  const list = APP_DATA.semuaSiswa.slice(0, 5);
  document.getElementById('siswaPreview').innerHTML = list.map(s => `
    <div style="display:flex;align-items:center;gap:.75rem;padding:.65rem 0;border-bottom:1px solid var(--gray-100);">
      <div style="width:34px;height:34px;border-radius:50%;background:var(--blue-100);display:flex;align-items:center;justify-content:center;font-size:.95rem;font-weight:700;color:var(--blue-700);">${s.nama[0]}</div>
      <div style="flex:1;">
        <div style="font-size:.88rem;font-weight:600;color:var(--gray-900);">${s.nama}</div>
        <div style="font-size:.75rem;color:var(--gray-500);">Kelas ${s.kelas}</div>
      </div>
      <span class="badge badge-blue">${s.rataRata}</span>
    </div>
  `).join('');
}

// ============ INFO PREVIEW ============
function renderInfoPreview() {
  const list = informasiData.slice(0, 4);
  document.getElementById('infoPreview').innerHTML = list.map(i => `
    <div class="guru-info-item">
      <div class="guru-info-icon">${i.icon}</div>
      <div class="guru-info-content">
        <div class="guru-info-title">${i.judul}</div>
        <div class="guru-info-date">📅 ${i.tanggal} · ${i.kategori}</div>
      </div>
    </div>
  `).join('');
}

// ============ KELAS STATS ============
function renderKelasStats() {
  const kelas = ['7', '8', '9'];
  document.getElementById('kelasStats').innerHTML = kelas.map(k => {
    const siswaKelas = APP_DATA.semuaSiswa.filter(s => s.kelas.startsWith(k));
    const materi = APP_DATA.materi[k] || [];
    const soal   = APP_DATA.soalCBT[k] || [];
    const tugas  = APP_DATA.tugas[k] || [];
    const avgNilai = siswaKelas.length
      ? (siswaKelas.reduce((a, s) => a + s.rataRata, 0) / siswaKelas.length).toFixed(1)
      : '-';
    return `
      <div class="kelas-stat-card">
        <div class="kelas-stat-title">🏫 Kelas ${k}</div>
        <div class="kelas-stat-row"><span>Jumlah Siswa</span><span>${siswaKelas.length} siswa</span></div>
        <div class="kelas-stat-row"><span>Materi PAI</span><span>${materi.length} bab</span></div>
        <div class="kelas-stat-row"><span>Soal CBT</span><span>${soal.length} soal</span></div>
        <div class="kelas-stat-row"><span>Tugas Aktif</span><span>${tugas.length} tugas</span></div>
        <div class="kelas-stat-row"><span>Rata-rata Nilai</span><span style="color:var(--primary);">${avgNilai}</span></div>
      </div>
    `;
  }).join('');
}

// ============ SISWA TABLE ============
function renderSiswaTable(filterK = '') {
  let siswa = APP_DATA.semuaSiswa;
  if (filterK) siswa = siswa.filter(s => s.kelas.startsWith(filterK));

  document.getElementById('siswaTableBody').innerHTML = siswa.map((s, i) => `
    <tr>
      <td><code>${s.nisn}</code></td>
      <td><strong>${s.nama}</strong></td>
      <td><span class="badge badge-blue">Kelas ${s.kelas}</span></td>
      <td>${s.rataRata}</td>
      <td>
        <div style="display:flex;align-items:center;gap:.5rem;">
          <div class="progress-bar" style="flex:1;height:6px;"><div class="progress-fill" style="width:${s.absensi}%;height:6px;"></div></div>
          <span style="font-size:.8rem;">${s.absensi}%</span>
        </div>
      </td>
      <td><span class="badge ${s.absensi >= 90 ? 'badge-green' : s.absensi >= 75 ? 'badge-yellow' : 'badge-red'}">${s.absensi >= 90 ? 'Baik' : s.absensi >= 75 ? 'Cukup' : 'Perlu Perhatian'}</span></td>
      <td>
        <div style="display:flex;gap:.4rem;">
          <button class="btn btn-sm btn-outline" onclick="showToast('Lihat detail: ${s.nama}','info')" style="padding: .2rem .4rem;">👁</button>
          <button class="btn btn-sm btn-warning" onclick="showToast('Edit siswa: ${s.nama}','info')" style="padding: .2rem .4rem;">✏️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterSiswa() {
  const k = document.getElementById('filterKelas').value;
  renderSiswaTable(k);
}

// ============ KELOLA MATERI ============
function renderKelolaMateri() {
  const k = document.getElementById('filterMateriKelas')?.value || '7';
  const materi = APP_DATA.materi[k] || [];
  document.getElementById('kelolaMateriList').innerHTML = materi.map(m => `
    <div class="kelola-materi-item">
      <div class="kelola-materi-num">${m.bab}</div>
      <div style="font-size:1.3rem;">${m.icon}</div>
      <div class="kelola-materi-info">
        <div class="kelola-materi-title">${m.judul}</div>
        <div class="kelola-materi-sub">⏱️ ${m.durasi} · ${m.subtopik.length} Subtopik · ${m.selesai ? '✅ Aktif' : '📌 Draf'}</div>
      </div>
      <span class="badge ${m.selesai ? 'badge-green' : 'badge-gray'}">${m.selesai ? 'Aktif' : 'Draf'}</span>
      <div class="kelola-materi-acts">
        <button class="btn btn-sm btn-outline" onclick="showToast('Edit materi: ${m.judul.substring(0,20)}','info')">✏️ Edit</button>
        <button class="btn btn-sm ${m.selesai ? 'btn-warning' : 'btn-success'}" onclick="showToast('Status diubah','success')">${m.selesai ? 'Nonaktifkan' : 'Aktifkan'}</button>
      </div>
    </div>
  `).join('');
}

// ============ KELOLA SOAL ============
function renderKelolaSoal() {
  const k = document.getElementById('filterSoalKelas')?.value || '7';
  const soal = APP_DATA.soalCBT[k] || [];
  const labels = ['A', 'B', 'C', 'D'];
  document.getElementById('kelolaSoalList').innerHTML = soal.map((s, i) => `
    <div class="soal-item">
      <div class="soal-item-header">
        <div style="display:flex;align-items:flex-start;gap:.65rem;flex:1;">
          <span class="soal-num">No. ${i + 1}</span>
          <div class="soal-teks">${s.soal}</div>
        </div>
        <div style="display:flex;gap:.4rem;flex-shrink:0;">
          <button class="btn btn-sm btn-outline" onclick="showToast('Edit soal ${i+1}','info')" style="padding: .2rem .4rem;">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="showToast('Hapus soal ${i+1}','error')" style="padding: .2rem .4rem;">🗑️</button>
        </div>
      </div>
      <div class="soal-pilihan">
        ${s.pilihan.map((p, pi) => `
          <div class="soal-pilihan-item ${pi === s.jawaban ? 'correct' : ''}">
            <span class="soal-pilihan-label">${labels[pi]}.</span>
            <span>${p}</span>
            ${pi === s.jawaban ? '<span style="margin-left:auto;">✅</span>' : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ============ KELOLA TUGAS ============
function renderKelolaTugas() {
  const k = document.getElementById('filterTugasKelas')?.value || '7';
  const tugas = APP_DATA.tugas[k] || [];
  document.getElementById('kelolaTugasList').innerHTML = tugas.map(t => `
    <div class="guru-tugas-card">
      <div style="font-size:1.3rem;">📤</div>
      <div class="guru-tugas-info">
        <div class="guru-tugas-title">${t.judul}</div>
        <div class="guru-tugas-meta">📚 ${t.matpel} · ⏰ ${t.deadline} · 🔗 ${t.link}</div>
        <div style="font-size:.78rem;color:var(--gray-500);margin-top:.15rem;">📝 ${t.ket}</div>
      </div>
      <span class="badge ${t.status === 'Sudah Dikumpul' ? 'badge-green' : 'badge-yellow'}">${t.status}</span>
      <div style="display:flex;gap:.4rem;">
        <button class="btn btn-sm btn-outline" onclick="showToast('Edit tugas','info')" style="padding: .2rem .4rem;">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="showToast('Tugas dihapus','error')" style="padding: .2rem .4rem;">🗑️</button>
      </div>
    </div>
  `).join('');
}

// ============ INFO / PENGUMUMAN ============
function renderInfoList() {
  document.getElementById('infoCount').textContent = `${informasiData.length} pengumuman`;
  document.getElementById('infoList').innerHTML = informasiData.map((info, i) => `
    <div class="guru-info-item">
      <div class="guru-info-icon">${info.icon}</div>
      <div class="guru-info-content">
        <div class="guru-info-title">${info.judul}</div>
        <div class="guru-info-date">📅 ${info.tanggal} · <span class="badge badge-blue" style="font-size:.7rem;">${info.kategori}</span> ${info.penting ? '<span class="badge badge-red" style="font-size:.7rem;">Penting</span>' : ''}</div>
        <div style="font-size:.82rem;color:var(--gray-500);margin-top:.25rem;">${info.isi.substring(0, 100)}...</div>
      </div>
      <div class="guru-info-acts">
        <button class="btn btn-sm btn-danger" onclick="hapusInfo(${i})" style="padding: .2rem .4rem;">🗑️</button>
      </div>
    </div>
  `).join('');
}

function hapusInfo(i) {
  informasiData.splice(i, 1);
  renderInfoList();
  renderInfoPreview();
  renderGuruStats();
  showToast('Pengumuman dihapus', 'success');
}

// ============ REKAP NILAI ============
function renderRekapNilai() {
  const filterK = document.getElementById('filterNilaiKelas')?.value || '';
  let siswa = APP_DATA.semuaSiswa;
  if (filterK) siswa = siswa.filter(s => s.kelas.startsWith(filterK));

  const sorted = [...siswa].sort((a, b) => b.rataRata - a.rataRata);

  document.getElementById('nilaiTableBody').innerHTML = sorted.map((s, i) => {
    const predikat = s.rataRata >= 90 ? 'A' : s.rataRata >= 80 ? 'B' : s.rataRata >= 70 ? 'C' : 'D';
    const badgeCls = predikat === 'A' ? 'badge-green' : predikat === 'B' ? 'badge-blue' : predikat === 'C' ? 'badge-yellow' : 'badge-red';
    return `
      <tr>
        <td><code>${s.nisn}</code></td>
        <td><strong>${s.nama}</strong></td>
        <td><span class="badge badge-blue">Kelas ${s.kelas}</span></td>
        <td><strong>${s.rataRata}</strong></td>
        <td><span class="badge ${badgeCls}">${predikat}</span></td>
        <td>
          <span style="background:var(--blue-50);color:var(--blue-700);font-weight:800;padding:.2rem .6rem;border-radius:var(--radius-full);font-size:.88rem;">
            ${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''} #${i + 1}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

// ============ ABSENSI GURU ============
function renderAbsensiGuru() {
  const siswaList = APP_DATA.semuaSiswa;
  // Absensi hanya ada untuk nisn yang terdaftar di APP_DATA.siswa
  const definedNisn = Object.keys(APP_DATA.siswa);

  let totalHadir = 0, totalSakit = 0, totalIzin = 0, totalAlpha = 0;
  definedNisn.forEach(nisn => {
    const a = APP_DATA.siswa[nisn].absensi;
    totalHadir += a.hadir; totalSakit += a.sakit; totalIzin += a.izin; totalAlpha += a.alpha;
  });

  document.getElementById('absensiGuruStats').innerHTML = [
    { icon: '✅', color: 'green',  value: totalHadir, label: 'Total Hadir (Sem.)' },
    { icon: '🤒', color: 'yellow', value: totalSakit,  label: 'Total Sakit' },
    { icon: '📝', color: 'blue',   value: totalIzin,   label: 'Total Izin' },
    { icon: '❌', color: 'red',    value: totalAlpha,  label: 'Total Alpha' },
  ].map(s => `
    <div class="stat-card">
      <div class="stat-card-icon ${s.color}">${s.icon}</div>
      <div class="stat-card-body">
        <div class="stat-card-value">${s.value}</div>
        <div class="stat-card-label">${s.label}</div>
      </div>
    </div>
  `).join('');

  // Tabel absensi
  const tbody = document.getElementById('absensiTableBody');
  tbody.innerHTML = siswaList.map(s => {
    const absensi = APP_DATA.siswa[s.nisn]?.absensi || { hadir: '-', sakit: '-', izin: '-', alpha: '-' };
    const total = (absensi.hadir || 0) + (absensi.sakit || 0) + (absensi.izin || 0) + (absensi.alpha || 0);
    const pct = total ? Math.round(((absensi.hadir || 0) / total) * 100) : s.absensi;
    return `
      <tr>
        <td><strong>${s.nama}</strong></td>
        <td><span class="badge badge-blue">Kelas ${s.kelas}</span></td>
        <td style="color:var(--success);font-weight:600;">${absensi.hadir}</td>
        <td style="color:var(--warning);font-weight:600;">${absensi.sakit}</td>
        <td style="color:var(--info);font-weight:600;">${absensi.izin}</td>
        <td style="color:var(--danger);font-weight:600;">${absensi.alpha}</td>
        <td>${pct}%</td>
        <td><span class="badge ${pct >= 90 ? 'badge-green' : pct >= 75 ? 'badge-yellow' : 'badge-red'}">${pct >= 90 ? '✅ Baik' : pct >= 75 ? '⚠️ Cukup' : '❌ Kurang'}</span></td>
      </tr>
    `;
  }).join('');
}

// ============ GURU TABLE ============
function renderGuruTable() {
  document.getElementById('guruTableBody').innerHTML = APP_DATA.guru.map(g => `
    <tr>
      <td><strong>${g.nama}</strong></td>
      <td><code>${g.nip}</code></td>
      <td>${g.kelas}</td>
      <td>${g.mataPelajaran.map(m => `<span class="badge badge-blue" style="margin-right:.25rem;">${m}</span>`).join('')}</td>
      <td><span class="badge badge-green">✅ Aktif</span></td>
    </tr>
  `).join('');
}

// ============ FORMS ============
function initForms() {
  // Form pengumuman
  document.getElementById('formPengumuman').addEventListener('submit', e => {
    e.preventDefault();
    const judul = document.getElementById('pJudul').value.trim();
    const isi   = document.getElementById('pIsi').value.trim();
    const kat   = document.getElementById('pKategori').value;
    const icon  = document.getElementById('pIcon').value || '📢';
    const pent  = document.getElementById('pPenting').checked;

    if (!judul || !isi) { showToast('Lengkapi judul dan isi!', 'error'); return; }

    const now = new Date();
    const tgl = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    informasiData.unshift({ id: `i${Date.now()}`, judul, isi, kategori: kat, icon, tanggal: tgl, penting: pent });
    renderInfoList();
    renderInfoPreview();
    renderGuruStats();
    e.target.reset();
    document.getElementById('pIcon').value = '📢';
    showToast('Pengumuman berhasil dipublikasikan! 📢', 'success');
  });

  // Form tambah siswa
  document.getElementById('formTambahSiswa').addEventListener('submit', e => {
    e.preventDefault();
    const nisn   = document.getElementById('addNisn').value.trim();
    const nama   = document.getElementById('addNama').value.trim();
    const kelas  = document.getElementById('addKelas').value;
    const kelasD = document.getElementById('addKelasDetail').value.trim() || `${kelas}A`;

    if (!nisn || !nama || !kelas) { showToast('Lengkapi data siswa!', 'error'); return; }

    APP_DATA.semuaSiswa.push({ nisn, nama, kelas: kelasD, rataRata: 0, absensi: 0 });
    renderSiswaTable();
    renderSiswaPreview();
    renderGuruStats();
    closeModal('modalSiswa');
    e.target.reset();
    showToast(`Siswa ${nama} berhasil ditambahkan! ✅`, 'success');
  });

  // Form tambah tugas
  document.getElementById('formTambahTugas').addEventListener('submit', e => {
    e.preventDefault();
    const judul  = document.getElementById('tJudul').value.trim();
    const matpel = document.getElementById('tMatpel').value;
    const kelas  = document.getElementById('tKelas').value;
    const ket    = document.getElementById('tKet').value.trim();
    const dl     = document.getElementById('tDeadline').value;
    const link   = document.getElementById('tLink').value.trim();

    if (!judul || !kelas) { showToast('Lengkapi judul dan kelas!', 'error'); return; }

    const tglDl = dl ? new Date(dl).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

    if (!APP_DATA.tugas[kelas]) APP_DATA.tugas[kelas] = [];
    APP_DATA.tugas[kelas].push({
      id: `t${Date.now()}`, judul, matpel, deadline: tglDl,
      link: link || 'https://forms.google.com', status: 'Belum Dikumpul', ket: ket || '-'
    });

    renderKelolaTugas();
    closeModal('modalTugas');
    e.target.reset();
    showToast(`Tugas berhasil ditambahkan! ✅`, 'success');
  });
}

// ============ MODALS ============
function showAddSiswaModal() {
  document.getElementById('modalSiswa').classList.add('open');
}
function showAddTugasModal() {
  document.getElementById('modalTugas').classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
    });
  });
});

// ============ SETTINGS ============
function saveSettings() {
  showToast('Pengaturan berhasil disimpan! ⚙️', 'success');
}

// ============ TOAST ============
function showToast(msg, type = 'info') {
  const container = document.querySelector('.toast-container');
  if(!container) return;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type === 'error' ? 'error' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
