const fs = require('fs');
let code = fs.readFileSync('client/src/context/AppContext.jsx', 'utf8');

const regexActiveTab = /const \[activeTab, setActiveTab\] = useState\(\(\) => \{\s*return activeRole === 'guru' \? 'admin_dashboard' : 'dashboard';\s*\}\);/;

const newActiveTab = `const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('portal_active_tab');
    if (savedTab) return savedTab;
    return activeRole === 'guru' ? 'admin_dashboard' : 'dashboard';
  });
  
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('portal_active_tab', activeTab);
    }
  }, [activeTab]);`;

const regexLogout = /localStorage\.removeItem\('portal_user'\);\s*setActiveTab\('dashboard'\);/;
const newLogout = `localStorage.removeItem('portal_user');
    localStorage.removeItem('portal_active_tab');
    setActiveTab('dashboard');`;

if (regexActiveTab.test(code)) {
  code = code.replace(regexActiveTab, newActiveTab);
  code = code.replace(regexLogout, newLogout);
  fs.writeFileSync('client/src/context/AppContext.jsx', code);
  console.log('Successfully persisted activeTab');
} else {
  console.log('Regex failed to match');
}
