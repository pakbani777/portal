const fs = require('fs');
let code = fs.readFileSync('client/src/components/UserManagement.jsx', 'utf8');

// 1. Update imports
if (!code.includes('deleteUser')) {
  code = code.replace(
    "import { createBulkUsers } from '../services/api';",
    "import { createBulkUsers, deleteUser } from '../services/api';"
  );
}

// 2. Add handleDeleteUser function
const handlePassSaveMarker = "const handlePasswordSave = async (id) => {";
const delFunction = `
  const handleDeleteUser = async (id, nama) => {
    if (!window.confirm(\`Yakin ingin menghapus \${nama}?\`)) return;
    try {
      const res = await deleteUser(id);
      if (res.success) {
        showToast(\`Pengguna \${nama} berhasil dihapus\`);
        sounds.playSuccess();
        loadUsers();
      } else {
        showToast(res.message);
      }
    } catch (e) {
      showToast('Gagal menghapus pengguna');
    }
  };
`;
if (!code.includes("handleDeleteUser")) {
  code = code.replace(handlePassSaveMarker, delFunction + "\n  " + handlePassSaveMarker);
}

// 3. Add Hapus button in the table
// Find `<button onClick={() => { sounds.playClick(); setEditingUserId(user.id); setNewPassword(''); }}`
const oldBtn = `<button
                          onClick={() => { sounds.playClick(); setEditingUserId(user.id); setNewPassword(''); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5 text-blue-600" /> Ubah Sandi
                        </button>`;
const newBtns = `<div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDeleteUser(user.id, user.nama)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Hapus
                          </button>
                          <button
                            onClick={() => { sounds.playClick(); setEditingUserId(user.id); setNewPassword(''); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            <Key className="w-3.5 h-3.5 text-blue-600" /> Ubah Sandi
                          </button>
                        </div>`;

if (!code.includes("handleDeleteUser(user.id")) {
  code = code.replace(oldBtn, newBtns);
}

fs.writeFileSync('client/src/components/UserManagement.jsx', code);
console.log('Added delete user UI');
