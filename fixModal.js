const fs = require('fs');
let code = fs.readFileSync('client/src/pages/TugasPage.jsx', 'utf8');

const modalStart = code.indexOf('{/* Modal Upload */}');
if (modalStart !== -1) {
  // find the corresponding end
  const modalEndStr = ')}';
  let modalEnd = code.lastIndexOf(modalEndStr);
  if (modalEnd !== -1) {
    code = code.substring(0, modalStart) + code.substring(modalEnd + modalEndStr.length);
  }
}

fs.writeFileSync('client/src/pages/TugasPage.jsx', code);
