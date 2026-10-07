const fs = require('fs');
let code = fs.readFileSync('client/src/components/UserManagement.jsx', 'utf8');

const targetLine = "onClick={() => { sounds.playClick(); setEditingUserId(user.id); setNewPassword(''); }}";

if (code.includes(targetLine)) {
  const replacement = `
                          <button
                            onClick={() => handleDeleteUser(user.id, user.nama)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors cursor-pointer mr-2"
                          >
                            Hapus
                          </button>
                          <button
                            onClick={() => { sounds.playClick(); setEditingUserId(user.id); setNewPassword(''); }}
`;
  
  // replace only the first match or all matches? well there's only one.
  code = code.replace(
    `<button\n                          onClick={() => { sounds.playClick(); setEditingUserId(user.id); setNewPassword(''); }}`, 
    replacement.trim()
  );
  
  // Fallback if \r\n
  code = code.replace(
    `<button\r\n                          onClick={() => { sounds.playClick(); setEditingUserId(user.id); setNewPassword(''); }}`, 
    replacement.trim()
  );
  
  fs.writeFileSync('client/src/components/UserManagement.jsx', code);
  console.log("Hapus button inserted using fallback");
} else {
  console.log("Target line not found");
}
