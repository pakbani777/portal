// ============================================
// LANDING.JS v2 — Updated for new HTML
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  renderTeachers();
  renderInfo();
  initLoginTabs();
  initLoginForms();
  initPasswordToggles();
  initScrollActiveNav();
  createToastContainer();
});

function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu  = document.getElementById('navMenu');
  const overlay  = document.getElementById('navOverlay');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  const toggleMenu = () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
  };

  hamburger.addEventListener('click', toggleMenu);
  if (overlay) overlay.addEventListener('click', toggleMenu);

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    });
  });
}

function initScrollActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.btn-login)');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => observer.observe(s));
}

function renderTeachers() {
  const grid = document.getElementById('teachersGrid');
  if (!grid) return;
  grid.innerHTML = APP_DATA.guru.map(g => `
    <div class="teacher-card">
      <div class="teacher-avatar">${g.icon}</div>
      <div class="teacher-name">${g.nama}</div>
      <div class="teacher-title">${g.title}</div>
      <div class="teacher-kelas">${g.kelas}</div>
      <div class="teacher-exp">🏆 ${g.pengalaman} Mengajar</div>
      <div class="teacher-edu">🎓 ${g.pendidikan}</div>
      <p class="teacher-bio">${g.bio}</p>
      <div class="teacher-tags">${g.mataPelajaran.map(m => `<span class="teacher-tag">${m}</span>`).join('')}</div>
    </div>
  `).join('');
}

function renderInfo() {
  const grid = document.getElementById('infoGrid');
  if (!grid) return;
  grid.innerHTML = APP_DATA.informasi.map(info => `
    <div class="info-card">
      <div class="info-card-accent"></div>
      <div class="info-card-body">
        <div class="info-top">
          <div class="info-icon-wrap">${info.icon}</div>
          <div class="info-meta">
            <div class="info-category">${info.kategori}</div>
            ${info.penting ? '<span class="info-urgent">🔴 Penting</span>' : ''}
          </div>
        </div>
        <div class="info-title">${info.judul}</div>
        <div class="info-text">${info.isi}</div>
        <div class="info-date">📅 ${info.tanggal}</div>
      </div>
    </div>
  `).join('');
}

function initLoginTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const forms   = document.querySelectorAll('.login-form');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.toggle('active', b === btn));
      forms.forEach(f => f.classList.toggle('active', f.id === `form${tab.charAt(0).toUpperCase() + tab.slice(1)}`));
    });
  });
}

function initLoginForms() {
  document.getElementById('formSiswa').addEventListener('submit', e => {
    e.preventDefault();
    const nisn  = document.getElementById('nisn').value.trim();
    const pw    = document.getElementById('passwordSiswa').value.trim();
    const kelas = document.getElementById('kelasSiswa').value;
    if (!nisn || !pw || !kelas) { showToast('Lengkapi semua kolom!', 'error'); return; }
    const siswa = APP_DATA.siswa[nisn];
    if (!siswa || siswa.password !== pw) { showToast('NISN atau password salah!', 'error'); return; }
    if (siswa.kelas !== kelas) { showToast(`NISN terdaftar di Kelas ${siswa.kelas}`, 'error'); return; }
    sessionStorage.setItem('user', JSON.stringify({ role:'siswa', nisn, kelas:siswa.kelas, nama:siswa.nama, kelasDetail:siswa.kelasDetail }));
    showToast(`Selamat datang, ${siswa.nama}! 🎉`, 'success');
    setTimeout(() => { window.location.href = 'dashboard-siswa.html'; }, 1000);
  });

  document.getElementById('formGuru').addEventListener('submit', e => {
    e.preventDefault();
    const nip = document.getElementById('nip').value.trim();
    const pw  = document.getElementById('passwordGuru').value.trim();
    if (!nip || !pw) { showToast('Lengkapi semua kolom!', 'error'); return; }
    const guru = APP_DATA.guru.find(g => g.nip === nip && g.password === pw);
    if (!guru) { showToast('NIP atau password salah!', 'error'); return; }
    sessionStorage.setItem('user', JSON.stringify({ role:'guru', nip, nama:guru.nama }));
    showToast(`Selamat datang, ${guru.nama}! 👨‍🏫`, 'success');
    setTimeout(() => { window.location.href = 'dashboard-guru.html'; }, 1000);
  });
}

function initPasswordToggles() {
  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      input.type  = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁️' : '🙈';
    });
  });
}

function createToastContainer() {
  if (!document.querySelector('.toast-container')) {
    const c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
}

function showToast(msg, type = 'info') {
  const container = document.querySelector('.toast-container');
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
