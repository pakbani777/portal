import { API_BASE_URL } from '../config';

// API Client Service terpusat Portal PakBani
const BASE_URL = `${API_BASE_URL}/api`;

export async function loginUser(credentials) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return res.json();
}

export async function fetchStats(kelas = '7', nama = 'Ahmad Fauzi') {
  const res = await fetch(`${BASE_URL}/dashboard/stats?kelas=${kelas}&nama=${encodeURIComponent(nama)}`);
  return res.json();
}

export async function fetchSiswa(kelas = '7-A') {
  const res = await fetch(`${BASE_URL}/siswa?kelas=${kelas}`);
  return res.json();
}

export async function fetchMateri(kelas = 'all', kategori = 'all', search = '') {
  let url = `${BASE_URL}/materi?kelas=${kelas}&kategori=${kategori}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchMateriById(id) {
  const res = await fetch(`${BASE_URL}/materi/${id}`);
  return res.json();
}

export async function createMateri(data) {
  const res = await fetch(`${BASE_URL}/materi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchJadwal(kelas = 'all', hari = 'all') {
  const res = await fetch(`${BASE_URL}/jadwal?kelas=${kelas}&hari=${hari}`);
  return res.json();
}

export async function fetchAbsensi(kelas = 'all', tanggal = '', nama = '', bulan = '') {
  let url = `${BASE_URL}/absensi?kelas=${kelas}`;
  if (tanggal) url += `&tanggal=${tanggal}`;
  if (bulan) url += `&bulan=${bulan}`;
  if (nama) url += `&nama=${encodeURIComponent(nama)}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchAbsensiBulanan(kelas = '7-A', bulan = '') {
  let url = `${BASE_URL}/absensi/bulanan?kelas=${kelas}`;
  if (bulan) url += `&bulan=${bulan}`;
  const res = await fetch(url);
  return res.json();
}

export async function submitBatchAbsensi(data) {
  const res = await fetch(`${BASE_URL}/absensi/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchRekapAbsensi(kelas = 'all') {
  const res = await fetch(`${BASE_URL}/absensi/rekap?kelas=${kelas}`);
  return res.json();
}

export async function fetchKuisList(kelas = 'all') {
  const res = await fetch(`${BASE_URL}/kuis?kelas=${kelas}`);
  return res.json();
}

export async function fetchKuisDetail(id) {
  const res = await fetch(`${BASE_URL}/kuis/${id}`);
  return res.json();
}

export async function submitKuis(data) {
  const res = await fetch(`${BASE_URL}/kuis/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchUlanganList(kelas = 'all') {
  const res = await fetch(`${BASE_URL}/ulangan?kelas=${kelas}`);
  return res.json();
}

export async function fetchUlanganDetail(id) {
  const res = await fetch(`${BASE_URL}/ulangan/${id}`);
  return res.json();
}

export async function submitUlangan(data) {
  const res = await fetch(`${BASE_URL}/ulangan/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchNilai(nama = '', kelas = 'all') {
  let url = `${BASE_URL}/nilai?kelas=${kelas}`;
  if (nama) url += `&nama=${encodeURIComponent(nama)}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchPengumuman() {
  const res = await fetch(`${BASE_URL}/pengumuman`);
  return res.json();
}
export const createPengumuman = async (data) => {
  const res = await fetch(`${API_BASE_URL}/api/pengumuman`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const createUser = async (data) => {
  const res = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const createBulkUsers = async (data) => {
  const res = await fetch(`${API_BASE_URL}/api/users/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};


export const fetchTugas = async (kelas = 'all') => {
  const res = await fetch(`${API_BASE_URL}/api/tugas?kelas=${kelas}`);
  return res.json();
};

export const createTugas = async (data) => {
  const res = await fetch(`${API_BASE_URL}/api/tugas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const submitTugas = async (tugasId, data) => {
  const res = await fetch(`${API_BASE_URL}/api/tugas/${tugasId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const fetchTugasSubmissions = async (tugasId) => {
  const res = await fetch(`${API_BASE_URL}/api/tugas/${tugasId}/submissions`);
  return res.json();
};

export async function createUlangan(data) {
  const res = await fetch(`${BASE_URL}/ulangan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export const deleteUser = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });
  return res.json();
};
