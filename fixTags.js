const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

// I'll manually replace the extra closing divs.
const bottomRegex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}/;
const newBottom = `</div>
        </div>
      )}`;

if (bottomRegex.test(code)) {
  code = code.replace(bottomRegex, newBottom);
  fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
  console.log('Fixed closing tags');
} else {
  // Let's try 3 divs
  const bottomRegex3 = /<\/div>\s*<\/div>\s*<\/div>\s*\)\}/;
  if (bottomRegex3.test(code)) {
    code = code.replace(bottomRegex3, newBottom);
    fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
    console.log('Fixed 3 closing tags');
  } else {
    console.log('Regex failed');
  }
}
