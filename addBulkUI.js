const fs = require('fs');
let c = fs.readFileSync('client/src/components/UserManagement.jsx', 'utf8');

const importApi = `import { fetchUsers, updateUserPassword, createUser, createBulkUsers } from '../services/api';`;
c = c.replace(/import { fetchUsers, updateUserPassword, createUser } from '\.\.\/services\/api';/, importApi);

const bulkState = `
  const [showBulkAddForm, setShowBulkAddForm] = useState(false);
  const [bulkForm, setBulkForm] = useState({ kelas: '7-A', password: 'siswa123', rawData: '' });
  const [bulking, setBulking] = useState(false);

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!bulkForm.kelas || !bulkForm.password || !bulkForm.rawData.trim()) {
      return showToast('Semua kolom (Kelas, Sandi, dan Data) harus diisi!');
    }
    setBulking(true);

    // Parse paste data (NISN, Nama)
    const lines = bulkForm.rawData.split('\\n').map(l => l.trim()).filter(l => l);
    const usersData = lines.map(line => {
      // support tab or comma separation
      const parts = line.split(/[\\t,]+/).map(p => p.trim());
      if (parts.length >= 2) {
        return { nisn: parts[0], nama: parts.slice(1).join(' ') };
      } else {
        return { nisn: '', nama: parts[0] };
      }
    });

    try {
      const res = await createBulkUsers({ kelas: bulkForm.kelas, defaultPassword: bulkForm.password, users: usersData });
      if (res.success) {
        showToast(\`Berhasil menambah \${usersData.length} siswa kelas \${bulkForm.kelas} secara massal!\`);
        setShowBulkAddForm(false);
        setBulkForm({ kelas: '7-A', password: 'siswa123', rawData: '' });
        loadUsers();
      } else {
        showToast(res.message);
      }
    } catch (e) {
      showToast('Terjadi kesalahan saat memproses data massal');
    }
    setBulking(false);
  };
`;

c = c.replace(/const \[showAddForm, setShowAddForm\] = useState\(false\);/, `const [showAddForm, setShowAddForm] = useState(false);\n` + bulkState);

const addButtons = `
          <div className="flex gap-2">
            <button
              onClick={() => { sounds.playClick(); setShowBulkAddForm(!showBulkAddForm); setShowAddForm(false); }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              {showBulkAddForm ? 'Tutup Input Massal' : 'Input Massal Siswa'}
            </button>
            <button
              onClick={() => { sounds.playClick(); setShowAddForm(!showAddForm); setShowBulkAddForm(false); }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              {showAddForm ? 'Batal Tambah' : 'Tambah Satuan'}
            </button>
          </div>
`;

c = c.replace(/<button[^>]*onClick={\(\) => { sounds\.playClick\(\); setShowAddForm\(!showAddForm\); }}[^>]*>[\s\S]*?<\/button>/, addButtons);

const bulkFormUI = `
      {/* Bulk Add Form */}
      {showBulkAddForm && (
        <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            🚀 Input Massal Siswa dari Excel (Copy-Paste)
          </h3>
          <form onSubmit={handleBulkSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Kelas</label>
                <input
                  type="text" required
                  value={bulkForm.kelas}
                  onChange={(e) => setBulkForm({ ...bulkForm, kelas: e.target.value })}
                  placeholder="Contoh: 7-A, 8-B"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Password Massal</label>
                <input
                  type="text" required
                  value={bulkForm.password}
                  onChange={(e) => setBulkForm({ ...bulkForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Paste Data Siswa (Format: NISN [TAB/KOMA] Nama Lengkap)</label>
              <textarea
                required rows="6"
                value={bulkForm.rawData}
                onChange={(e) => setBulkForm({ ...bulkForm, rawData: e.target.value })}
                placeholder="0012345678  Ahmad Fauzi\\n0087654321  Budi Santoso\\nAtau cukup copy 2 kolom (NISN dan Nama) dari Ms Excel lalu paste di sini."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono whitespace-pre"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit" disabled={bulking}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {bulking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Proses Input Massal
              </button>
            </div>
          </form>
        </div>
      )}
`;

c = c.replace(/{\/\* Add User Form \*\/}/, bulkFormUI + '\n      {/* Add User Form */}');

fs.writeFileSync('client/src/components/UserManagement.jsx', c);
