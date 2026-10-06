const fs = require('fs');
let c = fs.readFileSync('client/src/context/AppContext.jsx', 'utf8');

if (!c.includes('isMobileMenuOpen')) {
  c = c.replace(/const \[toast, setToast\] = useState\(null\);/, "const [toast, setToast] = useState(null);\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);");
  
  c = c.replace(/setActiveTab: switchTab,/, "setActiveTab: switchTab,\n      isMobileMenuOpen,\n      setIsMobileMenuOpen,");
  
  fs.writeFileSync('client/src/context/AppContext.jsx', c);
}
