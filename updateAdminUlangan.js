const fs = require('fs');

let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

// 1. Update Imports
if (!code.includes('createUlangan')) {
  code = code.replace(
    "import { fetchNilai, createMateri, createPengumuman, createTugas } from '../services/api';",
    "import { fetchNilai, createMateri, createPengumuman, createTugas, createUlangan } from '../services/api';"
  );
}

// 2. Add Tab Buttons
const tabButtonsTarget = `<button
            onClick={() => { sounds.playClick(); setActiveAdminTab('users'); }}
            className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
              activeAdminTab === 'users'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }\`}
          >
            Siswa
          </button>`;

const newTabButtons = `<button
            onClick={() => { sounds.playClick(); setActiveAdminTab('users'); }}
            className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
              activeAdminTab === 'users'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }\`}
          >
            Siswa
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveAdminTab('tugas'); }}
            className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
              activeAdminTab === 'tugas'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }\`}
          >
            Tugas
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveAdminTab('ulangan'); }}
            className={\`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
              activeAdminTab === 'ulangan'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }\`}
          >
            Ulangan CBT
          </button>`;

if (!code.includes("setActiveAdminTab('ulangan')")) {
  code = code.replace(tabButtonsTarget, newTabButtons);
}

// 3. Add Ulangan State and Handler
const handlerMarker = "const handlePengumumanSubmit = async (e) => {";
const ulanganLogic = `
  const [formUlangan, setFormUlangan] = useState({
    judul: '',
    jenis: 'UH',
    durasi_menit: 60,
    token_ujian: 'CBT123'
  });
  const [soalList, setSoalList] = useState([
    { id: 'q1', pertanyaan: '', pilihan: ['', '', '', ''], kunci: 0 }
  ]);
  const [submittingUlangan, setSubmittingUlangan] = useState(false);

  const handleAddSoal = () => {
    sounds.playClick();
    setSoalList([...soalList, { id: 'q' + Date.now(), pertanyaan: '', pilihan: ['', '', '', ''], kunci: 0 }]);
  };
  const handleRemoveSoal = (idx) => {
    sounds.playClick();
    const newSoal = [...soalList];
    newSoal.splice(idx, 1);
    setSoalList(newSoal);
  };
  const handleSoalChange = (idx, field, value) => {
    const newSoal = [...soalList];
    newSoal[idx][field] = value;
    setSoalList(newSoal);
  };
  const handlePilihanChange = (soalIdx, pilIdx, value) => {
    const newSoal = [...soalList];
    newSoal[soalIdx].pilihan[pilIdx] = value;
    setSoalList(newSoal);
  };
  const handleUlanganSubmit = async (e) => {
    e.preventDefault();
    if (!formUlangan.judul || !formUlangan.token_ujian) return showToast('Judul dan Token wajib diisi');
    
    // validate soal
    if (soalList.length === 0) return showToast('Minimal buat 1 soal');
    for (const s of soalList) {
      if (!s.pertanyaan || s.pilihan.some(p => !p.trim())) {
        return showToast('Pastikan semua pertanyaan dan pilihan jawaban terisi');
      }
    }
    
    setSubmittingUlangan(true);
    try {
      const res = await createUlangan({
        ...formUlangan,
        kelas: activeKelas,
        soal_json: soalList
      });
      if (res.success) {
        showToast('Ulangan CBT berhasil dijadwalkan!');
        sounds.playSuccess();
        setFormUlangan({ judul: '', jenis: 'UH', durasi_menit: 60, token_ujian: 'CBT123' });
        setSoalList([{ id: 'q1', pertanyaan: '', pilihan: ['', '', '', ''], kunci: 0 }]);
      } else {
        showToast(res.message);
      }
    } catch (error) {
      showToast('Gagal membuat ulangan');
    }
    setSubmittingUlangan(false);
  };

  const handlePengumumanSubmit = async (e) => {`;

if (!code.includes("const handleUlanganSubmit")) {
  code = code.replace(handlerMarker, ulanganLogic);
}

// 4. Add Ulangan UI block
const uiMarker = "{activeAdminTab === 'users' && <UserManagement />}";
const ulanganUI = `{activeAdminTab === 'users' && <UserManagement />}

        {activeAdminTab === 'ulangan' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
              📝 Buat Ulangan CBT Baru
            </h2>
            <form onSubmit={handleUlanganSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Judul Ulangan</label>
                  <input type="text" value={formUlangan.judul} onChange={e => setFormUlangan({...formUlangan, judul: e.target.value})} placeholder="Contoh: Penilaian Harian Bab 1" className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis Evaluasi</label>
                  <select value={formUlangan.jenis} onChange={e => setFormUlangan({...formUlangan, jenis: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm cursor-pointer">
                    <option value="UH">Ulangan Harian (UH)</option>
                    <option value="PTS">Penilaian Tengah Semester (PTS)</option>
                    <option value="PAS">Penilaian Akhir Semester (PAS)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Target Kelas</label>
                  <input type="text" value={activeKelas} disabled className="w-full px-4 py-2 rounded-xl bg-slate-200 border border-slate-300 text-sm opacity-70" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Durasi (Menit)</label>
                  <input type="number" min="10" max="180" value={formUlangan.durasi_menit} onChange={e => setFormUlangan({...formUlangan, durasi_menit: parseInt(e.target.value) || 60})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Token Ujian (Akses CBT)</label>
                  <input type="text" value={formUlangan.token_ujian} onChange={e => setFormUlangan({...formUlangan, token_ujian: e.target.value.toUpperCase()})} placeholder="Contoh: PAI7X" className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono tracking-widest text-blue-700 font-bold uppercase" required />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800">Daftar Soal Pilihan Ganda</h3>
                  <button type="button" onClick={handleAddSoal} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-200 transition flex items-center gap-1 cursor-pointer">
                    <PlusCircle className="w-4 h-4" /> Tambah Soal
                  </button>
                </div>

                <div className="space-y-4">
                  {soalList.map((soal, sIdx) => (
                    <div key={soal.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative">
                      {soalList.length > 1 && (
                        <button type="button" onClick={() => handleRemoveSoal(sIdx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 cursor-pointer">
                          <Settings className="w-4 h-4 opacity-0" />
                          <span className="text-xs font-bold bg-red-100 px-2 py-1 rounded-md">Hapus</span>
                        </button>
                      )}
                      <div className="mb-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Soal No. {sIdx + 1}</label>
                        <textarea rows="2" value={soal.pertanyaan} onChange={e => handleSoalChange(sIdx, 'pertanyaan', e.target.value)} placeholder="Tuliskan pertanyaan di sini..." className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm" required />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {soal.pilihan.map((pil, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name={\`kunci-\${soal.id}\`} 
                              checked={soal.kunci === pIdx}
                              onChange={() => handleSoalChange(sIdx, 'kunci', pIdx)}
                              className="w-4 h-4 text-blue-600 cursor-pointer" 
                            />
                            <input 
                              type="text" 
                              value={pil}
                              onChange={e => handlePilihanChange(sIdx, pIdx, e.target.value)}
                              placeholder={\`Opsi \${String.fromCharCode(65 + pIdx)}\`} 
                              className={\`w-full px-3 py-1.5 rounded-lg border text-sm \${soal.kunci === pIdx ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 bg-white'}\`} 
                              required 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button type="submit" disabled={submittingUlangan} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl cursor-pointer hover:bg-blue-700 transition flex items-center gap-2 shadow-md">
                  <ShieldCheck className="w-4 h-4" /> {submittingUlangan ? 'Menyimpan...' : 'Jadwalkan CBT'}
                </button>
              </div>
            </form>
          </div>
        )}`;

if (!code.includes("Buat Ulangan CBT Baru")) {
  code = code.replace(uiMarker, ulanganUI);
}

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
console.log('Admin page updated successfully');
