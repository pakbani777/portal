const fs = require('fs');
let code = fs.readFileSync('client/src/components/UserManagement.jsx', 'utf8');

const strStart = ") : (\n                          <button\n                            onClick={() => handleDeleteUser(user.id, user.nama)}";
const replStart = ") : (\n                          <div className=\"flex items-center justify-end gap-2\">\n                            <button\n                            onClick={() => handleDeleteUser(user.id, user.nama)}";

const strEnd = "                          <Key className=\"w-3.5 h-3.5 text-blue-600\" /> Ubah Sandi\n                          </button>\n                        )}";
const replEnd = "                          <Key className=\"w-3.5 h-3.5 text-blue-600\" /> Ubah Sandi\n                          </button>\n                          </div>\n                        )}";

// normalize
code = code.replace(/\r\n/g, '\n');
code = code.replace(strStart, replStart);
code = code.replace(strEnd, replEnd);

fs.writeFileSync('client/src/components/UserManagement.jsx', code);
console.log("Fixed wrapper via exact match");
