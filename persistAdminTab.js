const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

const regexAdminTab = /const \[activeAdminTab, setActiveAdminTab\] = useState\('materi_nilai'\);/;

const newAdminTab = `const [activeAdminTab, setActiveAdminTab] = useState(() => {
    return localStorage.getItem('portal_admin_tab') || 'materi_nilai';
  });

  useEffect(() => {
    localStorage.setItem('portal_admin_tab', activeAdminTab);
  }, [activeAdminTab]);`;

if (regexAdminTab.test(code)) {
  code = code.replace(regexAdminTab, newAdminTab);
  fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
  console.log('Successfully persisted activeAdminTab');
} else {
  console.log('Regex failed to match');
}
