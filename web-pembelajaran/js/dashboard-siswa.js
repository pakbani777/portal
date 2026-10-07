// ============================================
// DASHBOARD-SISWA.JS v2
// ============================================

let currentUser = null;
let currentKelas = '';
let soalAktif = [];
let idxSoal = 0;
let jawabanSiswa = [];
let timerInterval;

document.addEventListener('DOMContentLoaded', () => {
  const rawUser = sessionStorage.getItem('user');
  if (!rawUser) { window.location.href = 'index.html#login'; return; }

  currentUser = JSON.parse(rawUser);
  if (currentUser.role !== 'siswa') { window.location.href = 'index.html#login'; return; }

  currentKelas = currentUser.kelas;
  
  initUI();
  initNav();
  initSidebar();
  updateClock();
  setInterval(updateClock, 1000);
});

// ============ UI INIT ============
function initUI() {
  document.getElementById('siswaNama').textContent = currentUser.nama;
  document.getElementById('siswaAvatar').textContent = currentUser.nama[0];
  document.getElementById('siswaKelasSpan').textContent = `Kelas ${currentUser.kelasDetail}`;
  document.getElementById('welcomeName').textContent = currentUser.nama.split(' ')[0];
  document.getElementById('materiKelasLbl').textContent = currentUser.kelasDetail;

  renderBerandaStats();
  renderPengumuman();
  renderMateriTerbaru();
  renderMateri();
  renderBadges();
  renderTugas();
  renderNilai();
  renderAbsensi();

  initUjianCBT();
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
  document.getElementById(`page-${page}`).classList.add('active');

  const titles = {
    beranda: '🏠 Beranda Siswa',
    materi: '📖 Materi PAI',
    ujian: '✍️ Ujian CBT',
    tugas: '📤 Kumpul Tugas',
    nilai: '📊 Hasil Nilai',
    absensi: '📅 Info Absensi'
  };
  document.getElementById('topbarTitle').textContent = titles[page];
}

function initSidebar() {
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  overlay.addEventListener('click', () => sidebar.classList.remove('open'));
}

// ============ BERANDA ============
function renderBerandaStats() {
  const materi = APP_DATA.materi[currentKelas] || [];
  const tugas = APP_DATA.tugas[currentKelas] || [];
  const sData = APP_DATA.siswa[currentUser.nisn] || { absensi: { hadir:0, sakit:0, izin:0, alpha:0 } };
  const totalHari = sData.absensi.hadir + sData.absensi.sakit + sData.absensi.izin + sData.absensi.alpha;
  const pctHadir = totalHari ? Math.round((sData.absensi.hadir / totalHari) * 100) : 100;

  const stats = [
    { icon: '📖', color: 'blue', value: `${materi.filter(m=>m.selesai).length}/${materi.length}`, label: 'Materi Selesai' },
    { icon: '📝', color: 'yellow', value: tugas.filter(t=>t.status==='Belum Dikumpul').length, label: 'Tugas Menunggu' },
    { icon: '✅', color: 'green', value: `${pctHadir}%`, label: 'Kehadiran' }
  ];

  document.getElementById('berandaStats').innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-card-icon ${s.color}">${s.icon}</div>
      <div class="stat-card-body">
        <div class="stat-card-value">${s.value}</div>
        <div class="stat-card-label">${s.label}</div>
      </div>
    </div>
  `).join('');
}

function renderPengumuman() {
  const list = APP_DATA.informasi.slice(0, 3);
  document.getElementById('berandaPengumuman').innerHTML = list.map(i => `
    <div class="dash-info-item">
      <div class="dash-info-icon">${i.icon}</div>
      <div class="dash-info-content">
        <div class="dash-info-header">
          <div class="dash-info-title">${i.judul} ${i.penting ? '<span class="badge badge-red" style="font-size:.65rem; margin-left:.4rem;">Penting</span>' : ''}</div>
          <div class="dash-info-date">${i.tanggal}</div>
        </div>
        <div class="dash-info-desc">${i.isi}</div>
      </div>
    </div>
  `).join('');
}

function renderMateriTerbaru() {
  const materi = APP_DATA.materi[currentKelas] || [];
  const terbaru = materi.slice(0, 2);
  document.getElementById('berandaMateri').innerHTML = terbaru.map(m => `
    <div class="dash-info-item" style="cursor:pointer;" onclick="navTo('materi')">
      <div class="dash-info-icon" style="background:var(--blue-50); border-color:var(--blue-100);">${m.icon}</div>
      <div class="dash-info-content">
        <div class="dash-info-title">${m.judul}</div>
        <div class="dash-info-date" style="margin-top:.3rem; display:flex; gap:.5rem;">
          <span class="badge ${m.selesai ? 'badge-green' : 'badge-gray'}">${m.selesai ? '✅ Selesai' : '⏳ Belum Selesai'}</span>
          <span>${m.durasi}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function renderBadges() {
  const tugas = APP_DATA.tugas[currentKelas] || [];
  const tMenunggu = tugas.filter(t => t.status === 'Belum Dikumpul').length;
  const bTugas = document.getElementById('badgeTugas');
  if (tMenunggu > 0) {
    bTugas.textContent = tMenunggu; bTugas.style.display = 'block';
  } else {
    bTugas.style.display = 'none';
  }
  document.getElementById('badgeUjian').textContent = '1';
}

// ============ MATERI ============
function renderMateri() {
  const materi = APP_DATA.materi[currentKelas] || [];
  document.getElementById('materiList').innerHTML = materi.map((m, i) => `
    <div class="materi-item" id="mat-${i}">
      <div class="materi-header" onclick="document.getElementById('mat-${i}').classList.toggle('open')">
        <div class="materi-icon">${m.icon}</div>
        <div class="materi-info">
          <div class="materi-title">${m.judul}</div>
          <div class="materi-meta">
            <span>Bab ${m.bab}</span> • <span>⏱️ ${m.durasi}</span> • 
            <span style="color:${m.selesai ? 'var(--success)' : 'var(--gray-400)'}; font-weight:600;">
              ${m.selesai ? '✅ Selesai' : '⏳ Belum'}
            </span>
          </div>
        </div>
        <div class="materi-toggle">▼</div>
      </div>
      <div class="materi-content">
        <div class="materi-body">
          <p style="font-size:.9rem; color:var(--gray-600); line-height:1.6;">${m.deskripsi}</p>
          <div class="subtopik-list">
            ${m.subtopik.map(s => `<div class="subtopik-item"><span class="subtopik-icon">🔹</span>${s}</div>`).join('')}
          </div>
          <button class="btn btn-primary btn-sm" onclick="openModalMateri(${i})">
            📄 Buka Modul Lengkap
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function openModalMateri(idx) {
  const m = APP_DATA.materi[currentKelas][idx];
  document.getElementById('mdlTitle').textContent = m.judul;
  document.getElementById('mdlDesc').textContent = m.deskripsi;
  document.getElementById('modalMateri').classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// ============ UJIAN CBT ============
function initUjianCBT() {
  document.getElementById('btnMulaiUjian').addEventListener('click', () => {
    soalAktif = [...(APP_DATA.soalCBT[currentKelas] || [])].sort(() => 0.5 - Math.random());
    jawabanSiswa = new Array(soalAktif.length).fill(null);
    idxSoal = 0;
    
    document.getElementById('ujianIntro').style.display = 'none';
    document.getElementById('ujianArea').classList.add('active');
    
    renderSoal();
    startTimer(15 * 60); // 15 menit
  });

  document.getElementById('btnSoalPrev').addEventListener('click', () => { if(idxSoal > 0) { idxSoal--; renderSoal(); } });
  document.getElementById('btnSoalNext').addEventListener('click', () => { if(idxSoal < soalAktif.length-1) { idxSoal++; renderSoal(); } });
  document.getElementById('btnSelesaiUjian').addEventListener('click', selesaiUjian);
}

function renderSoal() {
  const soal = soalAktif[idxSoal];
  document.getElementById('ujianProgress').textContent = `Soal ${idxSoal + 1} dari ${soalAktif.length}`;
  document.getElementById('soalTeks').textContent = soal.soal;
  
  const labels = ['A', 'B', 'C', 'D'];
  document.getElementById('pilihanList').innerHTML = soal.pilihan.map((p, i) => `
    <button class="pilihan-btn ${jawabanSiswa[idxSoal] === i ? 'selected' : ''}" onclick="pilihJawaban(${i})">
      <div class="pilihan-label">${labels[i]}</div>
      <div>${p}</div>
    </button>
  `).join('');

  document.getElementById('btnSoalPrev').disabled = idxSoal === 0;
  
  if (idxSoal === soalAktif.length - 1) {
    document.getElementById('btnSoalNext').style.display = 'none';
    document.getElementById('btnSelesaiUjian').style.display = 'block';
  } else {
    document.getElementById('btnSoalNext').style.display = 'block';
    document.getElementById('btnSelesaiUjian').style.display = 'none';
  }
}

function pilihJawaban(idx) {
  jawabanSiswa[idxSoal] = idx;
  renderSoal();
}

function startTimer(seconds) {
  const el = document.getElementById('ujianTimer');
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds--;
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    el.textContent = `${m}:${s}`;
    if (seconds <= 0) { clearInterval(timerInterval); selesaiUjian(); }
  }, 1000);
}

function selesaiUjian() {
  clearInterval(timerInterval);
  let benar = 0;
  soalAktif.forEach((s, i) => { if(jawabanSiswa[i] === s.jawaban) benar++; });
  const nilai = Math.round((benar / soalAktif.length) * 100);

  document.getElementById('ujianArea').classList.remove('active');
  document.getElementById('ujianHasil').classList.add('active');
  
  const nc = document.getElementById('hasilNilai');
  nc.textContent = nilai;
  nc.style.background = nilai >= 75 ? 'var(--grad-primary)' : 'linear-gradient(135deg, #ef4444, #dc2626)';
  
  document.getElementById('hasilBenar').textContent = benar;
  document.getElementById('hasilSalah').textContent = soalAktif.length - benar;
  document.getElementById('badgeUjian').style.display = 'none';
  showToast('Ujian selesai! Nilai berhasil disimpan.', 'success');
}

// ============ TUGAS ============
function renderTugas() {
  const tugas = APP_DATA.tugas[currentKelas] || [];
  document.getElementById('tugasList').innerHTML = tugas.map(t => `
    <div class="tugas-card">
      <div class="tugas-icon">📝</div>
      <div class="tugas-info">
        <div class="tugas-title">${t.judul}</div>
        <div class="tugas-meta">
          <span>📚 ${t.matpel}</span> • <span>⏰ ${t.deadline}</span>
        </div>
      </div>
      <div>
        ${t.status === 'Sudah Dikumpul' 
          ? `<span class="badge badge-green">✅ Sudah Dikumpul</span>`
          : `<a href="${t.link}" target="_blank" class="btn btn-sm btn-primary">Kumpulkan Form ↗</a>`
        }
      </div>
    </div>
  `).join('');
}

// ============ NILAI ============
function renderNilai() {
  const nilai = APP_DATA.nilai[currentUser.nisn] || [];
  
  // Table
  document.getElementById('nilaiTableBody').innerHTML = nilai.map(n => {
    const rata = ((n.uh1 + n.uh2 + n.uts + n.uas) / 4).toFixed(1);
    const badge = rata >= 90 ? 'badge-green' : rata >= 80 ? 'badge-blue' : rata >= 70 ? 'badge-yellow' : 'badge-red';
    return `
      <tr>
        <td><strong>${n.matpel}</strong></td>
        <td>${n.uh1}</td><td>${n.uh2}</td><td>${n.uts}</td><td>${n.uas}</td>
        <td><span class="badge ${badge}" style="font-size:.85rem;">${rata}</span></td>
      </tr>
    `;
  }).join('');

  // Chart
  if (nilai.length > 0) {
    const n = nilai[0]; // ambil PAI saja untuk chart
    const data = [
      { lbl: 'UH1', val: n.uh1 }, { lbl: 'UH2', val: n.uh2 },
      { lbl: 'UTS', val: n.uts }, { lbl: 'UAS', val: n.uas }
    ];
    document.getElementById('nilaiChart').innerHTML = `
      <div class="chart-grid-line" style="bottom:25%;"></div>
      <div class="chart-grid-line" style="bottom:50%;"></div>
      <div class="chart-grid-line" style="bottom:75%;"></div>
      <div class="chart-grid-line" style="bottom:100%;"></div>
      ${data.map(d => `
        <div class="bar-group">
          <div class="bar" style="height:${d.val}%"><span class="bar-val">${d.val}</span></div>
          <span class="bar-lbl">${d.lbl}</span>
        </div>
      `).join('')}
    `;
    // trigger animation
    setTimeout(() => {
      document.querySelectorAll('.bar').forEach(b => {
        b.style.height = b.style.height; // force reflow
      });
    }, 100);
  }
}

// ============ ABSENSI ============
function renderAbsensi() {
  const data = APP_DATA.siswa[currentUser.nisn]?.absensi || { hadir:0, sakit:0, izin:0, alpha:0 };
  const t = data.hadir + data.sakit + data.izin + data.alpha;
  const pct = t ? Math.round((data.hadir / t) * 100) : 100;

  document.getElementById('absensiStats').innerHTML = [
    { l: 'Hadir', v: data.hadir, c: 'green', i: '✅' },
    { l: 'Sakit', v: data.sakit, c: 'yellow', i: '🤒' },
    { l: 'Izin',  v: data.izin,  c: 'blue', i: '📝' },
    { l: 'Alpha', v: data.alpha, c: 'red', i: '❌' },
    { l: 'Persentase', v: `${pct}%`, c: pct >= 80 ? 'green' : 'red', i: '📊' }
  ].map(s => `
    <div class="stat-card" style="padding:1rem;">
      <div class="stat-card-icon ${s.c}" style="width:36px;height:36px;font-size:1.1rem;">${s.i}</div>
      <div class="stat-card-body">
        <div class="stat-card-value" style="font-size:1.2rem;">${s.v}</div>
        <div class="stat-card-label" style="font-size:.7rem;">${s.l}</div>
      </div>
    </div>
  `).join('');

  // Generate Dummy Calendar (Oct 2026 starts on Thu)
  const cal = document.getElementById('absensiCalendar');
  const days = [];
  for(let i=0; i<4; i++) days.push('<div class="cal-day empty"></div>'); // offset Min,Sen,Sel,Rab
  
  // 31 days
  for(let i=1; i<=31; i++) {
    // Make weekends empty, rest hadir, some random sakit/izin
    const d = (i + 4) % 7; // 0=Sun, 6=Sat
    let cls = '';
    if (d === 0 || d === 6) cls = 'empty';
    else if (i === 12) cls = 'cal-sakit';
    else if (i === 20) cls = 'cal-izin';
    else if (i === 27) cls = 'cal-alpha';
    else cls = 'cal-hadir';
    
    days.push(`<div class="cal-day ${cls}" title="${cls.replace('cal-','').toUpperCase()}">${d===0||d===6 ? '' : i}</div>`);
  }
  
  // append after headers
  cal.innerHTML = cal.innerHTML.split('<!-- Injected by JS -->')[0] + days.join('');
}

// ============ TOAST UTILS ============
function showToast(msg, type = 'info') {
  const container = document.querySelector('.toast-container');
  if(!container) return;
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type === 'error' ? 'error' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'}`;
  toast.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
