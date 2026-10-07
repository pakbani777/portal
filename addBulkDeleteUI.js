const fs = require('fs');
let code = fs.readFileSync('client/src/components/UserManagement.jsx', 'utf8');

// 1. Import
code = code.replace(
  "import { createBulkUsers, deleteUser } from '../services/api';",
  "import { createBulkUsers, deleteUser, deleteBulkUsers } from '../services/api';"
);

// 2. States and logic
const hooksEnd = `  const [bulking, setBulking] = useState(false);`;
const bulkLogic = `  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deletingBulk, setDeletingBulk] = useState(false);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uId => uId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleDeleteBulk = async () => {
    if (selectedUsers.length === 0) return;
    if (!window.confirm(\`Yakin ingin menghapus \${selectedUsers.length} pengguna terpilih?\`)) return;
    
    setDeletingBulk(true);
    try {
      const res = await deleteBulkUsers(selectedUsers);
      if (res.success) {
        showToast(res.message);
        sounds.playSuccess();
        setSelectedUsers([]);
        loadUsers();
      } else {
        showToast(res.message);
      }
    } catch (e) {
      showToast('Gagal menghapus pengguna massal');
    } finally {
      setDeletingBulk(false);
    }
  };`;

if (!code.includes("selectedUsers")) {
  code = code.replace(hooksEnd, hooksEnd + "\n" + bulkLogic);
}

// 3. UI - Table header and Bulk Delete button
const tableStart = `<table className="w-full text-left text-sm">`;
const tableStartNew = `
          {selectedUsers.length > 0 && (
            <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center justify-between">
              <span className="text-sm font-bold text-red-700">
                {selectedUsers.length} pengguna dipilih
              </span>
              <button
                onClick={handleDeleteBulk}
                disabled={deletingBulk}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
              >
                {deletingBulk ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Hapus Terpilih
              </button>
            </div>
          )}
          <table className="w-full text-left text-sm">`;
if (!code.includes("selectedUsers.length > 0 &&")) {
  code = code.replace(tableStart, tableStartNew);
}

const theadOld = `<tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs">
                <th className="py-3 px-4">Nama & Role</th>`;
const theadNew = `<tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs">
                <th className="py-3 px-4 w-12">
                  <input type="checkbox" className="rounded text-blue-600 cursor-pointer" onChange={handleSelectAll} checked={users.length > 0 && selectedUsers.length === users.length} />
                </th>
                <th className="py-3 px-4">Nama & Role</th>`;
if (!code.includes("onChange={handleSelectAll}")) {
  code = code.replace(theadOld, theadNew);
  // fallback for crlf
  code = code.replace(
    `<tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs">\r\n                <th className="py-3 px-4">Nama & Role</th>`,
    `<tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs">\r\n                <th className="py-3 px-4 w-12">\r\n                  <input type="checkbox" className="rounded text-blue-600 cursor-pointer" onChange={handleSelectAll} checked={users.length > 0 && selectedUsers.length === users.length} />\r\n                </th>\r\n                <th className="py-3 px-4">Nama & Role</th>`
  );
}

const tbodyOld = `<tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">`;
const tbodyNew = `<tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <input type="checkbox" className="rounded text-blue-600 cursor-pointer" checked={selectedUsers.includes(user.id)} onChange={() => handleSelectUser(user.id)} />
                    </td>
                    <td className="py-3 px-4 flex items-center gap-3">`;
if (!code.includes("handleSelectUser(user.id)")) {
  code = code.replace(tbodyOld, tbodyNew);
  // fallback for crlf
  code = code.replace(
    `<tr key={user.id} className="hover:bg-slate-50 transition-colors">\r\n                    <td className="py-3 px-4 flex items-center gap-3">`,
    `<tr key={user.id} className="hover:bg-slate-50 transition-colors">\r\n                    <td className="py-3 px-4">\r\n                      <input type="checkbox" className="rounded text-blue-600 cursor-pointer" checked={selectedUsers.includes(user.id)} onChange={() => handleSelectUser(user.id)} />\r\n                    </td>\r\n                    <td className="py-3 px-4 flex items-center gap-3">`
  );
}

const colSpanOld = `<td colSpan={4} className="py-8 text-center text-slate-400">`;
const colSpanNew = `<td colSpan={5} className="py-8 text-center text-slate-400">`;
code = code.replace(colSpanOld, colSpanNew);

fs.writeFileSync('client/src/components/UserManagement.jsx', code);
console.log('Added bulk delete logic to UI');
