const fs = require('fs');
let code = fs.readFileSync('client/src/App.jsx', 'utf8');

if (!code.includes("case 'nilai':")) {
  const regex = /case 'ulangan':\s*return <UlanganPage \/>;/;
  const replacement = `case 'ulangan':\n          return <UlanganPage />;\n        case 'nilai':\n          return <NilaiPage />;`;
  
  if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('client/src/App.jsx', code);
    console.log('App.jsx updated with nilai case');
  } else {
    console.log('Regex failed');
  }
}

if (!code.includes("import NilaiPage")) {
  const importRegex = /import GuruAdminPage from '\.\/pages\/GuruAdminPage';/;
  const importReplacement = `import GuruAdminPage from './pages/GuruAdminPage';\nimport NilaiPage from './pages/NilaiPage';`;
  
  if (importRegex.test(code)) {
    code = code.replace(importRegex, importReplacement);
    fs.writeFileSync('client/src/App.jsx', code);
    console.log('App.jsx imported NilaiPage');
  } else {
    console.log('Import Regex failed');
  }
}
