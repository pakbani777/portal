const fs = require('fs');
let code = fs.readFileSync('client/src/components/UserManagement.jsx', 'utf8');

const targetStr = `) : (
                          <button
                              onClick={() => handleDeleteUser(user.id, user.nama)}`;

if (code.includes(targetStr)) {
  code = code.replace(
    targetStr,
    `) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                                onClick={() => handleDeleteUser(user.id, user.nama)}`
  );
  
  code = code.replace(
    `                            <Key className="w-3.5 h-3.5 text-blue-600" /> Ubah Sandi
                          </button>
                        )}`,
    `                            <Key className="w-3.5 h-3.5 text-blue-600" /> Ubah Sandi
                          </button>
                          </div>
                        )}`
  );
  
  fs.writeFileSync('client/src/components/UserManagement.jsx', code);
  console.log("Fixed JSX wrapper");
} else {
  // Let's try flexible replace
  let success = false;
  
  if (code.includes(') : (\r\n                          <button\r\n                              onClick={() => handleDeleteUser')) {
    code = code.replace(
      ') : (\r\n                          <button\r\n                              onClick={() => handleDeleteUser',
      ') : (\r\n                          <div className="flex justify-end gap-2">\r\n                            <button\r\n                              onClick={() => handleDeleteUser'
    );
    success = true;
  }
  
  if (code.includes(') : (\n                          <button\n                              onClick={() => handleDeleteUser')) {
    code = code.replace(
      ') : (\n                          <button\n                              onClick={() => handleDeleteUser',
      ') : (\n                          <div className="flex justify-end gap-2">\n                            <button\n                              onClick={() => handleDeleteUser'
    );
    success = true;
  }
  
  if (success) {
    code = code.replace(
      `                            <Key className="w-3.5 h-3.5 text-blue-600" /> Ubah Sandi\n                          </button>\n                        )}`,
      `                            <Key className="w-3.5 h-3.5 text-blue-600" /> Ubah Sandi\n                          </button>\n                          </div>\n                        )}`
    );
    code = code.replace(
      `                            <Key className="w-3.5 h-3.5 text-blue-600" /> Ubah Sandi\r\n                          </button>\r\n                        )}`,
      `                            <Key className="w-3.5 h-3.5 text-blue-600" /> Ubah Sandi\r\n                          </button>\r\n                          </div>\r\n                        )}`
    );
    fs.writeFileSync('client/src/components/UserManagement.jsx', code);
    console.log("Fixed JSX wrapper using flexible match");
  } else {
    console.log("Still not found");
  }
}
