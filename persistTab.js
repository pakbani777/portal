const fs = require('fs');
let code = fs.readFileSync('client/src/context/AppContext.jsx', 'utf8');

const oldActiveTab = `  // Tab aktif: disesuaikan berdasarkan peran
  const [activeTab, setActiveTab] = useState(() => {
    return activeRole === 'guru' ? 'admin_dashboard' : 'dashboard';
  });`;

const newActiveTab = `  // Tab aktif: disesuaikan berdasarkan peran
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('portal_active_tab');
    if (savedTab) return savedTab;
    return activeRole === 'guru' ? 'admin_dashboard' : 'dashboard';
  });
  
  useEffect(() => {
    localStorage.setItem('portal_active_tab', activeTab);
  }, [activeTab]);`;

const oldLogin = `    if (userData.role === 'siswa' && userData.kelas) {
      setActiveKelas(userData.kelas.charAt(0));
      setActiveTab('dashboard');
    } else {
      setActiveTab('admin_dashboard');
    }`;

const newLogin = `    if (userData.role === 'siswa' && userData.kelas) {
      setActiveKelas(userData.kelas.charAt(0));
      setActiveTab('dashboard');
    } else {
      setActiveTab('admin_dashboard');
    }`; // login should reset to default maybe? Or keep saved tab? Keep saved tab might be weird if they log out and log in as another role. But logout clears it anyway. Let's see logout.

const oldLogout = `    localStorage.removeItem('portal_user');
    setActiveTab('dashboard');`;

const newLogout = `    localStorage.removeItem('portal_user');
    localStorage.removeItem('portal_active_tab');
    setActiveTab('dashboard');`;

if (code.includes('activeRole === \'guru\' ? \'admin_dashboard\' : \'dashboard\'')) {
  code = code.replace(oldActiveTab, newActiveTab);
  code = code.replace(oldLogout, newLogout);
  fs.writeFileSync('client/src/context/AppContext.jsx', code);
  console.log('Persisted activeTab to localStorage');
} else {
  console.log('Could not find activeTab state');
}
