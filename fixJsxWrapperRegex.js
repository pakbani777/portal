const fs = require('fs');
let code = fs.readFileSync('client/src/components/UserManagement.jsx', 'utf8');

const s1 = `                        ) : (
                          <button
                              onClick={() => handleDeleteUser`;
const s2 = `                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleDeleteUser`;

const e1 = `                          </button>
                        )}
                      </td>`;
const e2 = `                          </button>
                          </div>
                        )}
                      </td>`;

// Standardize newlines before replace to avoid \r\n issues
code = code.replace(/\\r\\n/g, '\\n');

if (code.includes(') : (\\n                          <button\\n                              onClick={() => handleDeleteUser')) {
  // It has spaces/indent differences, let's just do regex
}

code = code.replace(
  /\\)\\s*:\\s*\\(\\s*<button\\s*onClick=\\{\\(\\)\\s*=>\\s*handleDeleteUser/g,
  ') : ( <div className="flex justify-end gap-2"> <button onClick={() => handleDeleteUser'
);

code = code.replace(
  /<Key className="w-3\.5 h-3\.5 text-blue-600" \/> Ubah Sandi\s*<\/button>\s*\)\}/g,
  '<Key className="w-3.5 h-3.5 text-blue-600" /> Ubah Sandi </button> </div> )}'
);

fs.writeFileSync('client/src/components/UserManagement.jsx', code);
console.log("Fixed wrapper via regex");
