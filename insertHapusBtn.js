const fs = require('fs');
let code = fs.readFileSync('client/src/components/UserManagement.jsx', 'utf8');

const targetBtnStart = `<button
                          onClick={() => { sounds.playClick(); setEditingUserId(user.id); setNewPassword(''); }}`;

if (code.includes(targetBtnStart)) {
  const insertText = `
                          <button
                            onClick={() => handleDeleteUser(user.id, user.nama)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors cursor-pointer mr-2"
                          >
                            Hapus
                          </button>`;
  
  code = code.replace(targetBtnStart, insertText + "\n" + targetBtnStart);
  fs.writeFileSync('client/src/components/UserManagement.jsx', code);
  console.log("Hapus button inserted");
} else {
  console.log("Target not found");
}
