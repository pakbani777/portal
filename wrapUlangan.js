const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

const regex2 = /\{activeAdminTab === 'ulangan' && \(\s*<div className="bg-white/;
const replacement2 = `{activeAdminTab === 'ulangan' && (\n          <>\n            <div className="bg-white`;

if (regex2.test(code)) {
  code = code.replace(regex2, replacement2);
  fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
  console.log('Successfully wrapped ulangan tab with fragment');
} else {
  console.log('Regex failed to match');
}
