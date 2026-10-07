const fs = require('fs');
let code = fs.readFileSync('client/src/components/UserManagement.jsx', 'utf8');

code = code.replace(
  /\\)\\s*:\\s*\\(\\s*<button\\s+onClick=\\{\\(\\)\\s*=>\\s*handleDeleteUser/,
  ') : ( <div className="flex items-center justify-end gap-2"> <button onClick={() => handleDeleteUser'
);

code = code.replace(
  /<Key className="w-3\.5 h-3\.5 text-blue-600" \/> Ubah Sandi\s*<\/button>\s*\)\}/,
  '<Key className="w-3.5 h-3.5 text-blue-600" /> Ubah Sandi </button> </div> )}'
);

fs.writeFileSync('client/src/components/UserManagement.jsx', code);
console.log("Fixed wrapper via regex");
