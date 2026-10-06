const fs = require('fs');
let c = fs.readFileSync('client/src/App.jsx', 'utf8');

c = c.replace(/import BottomNav from '\.\/components\/BottomNav';\n/, '');
c = c.replace(/{\/\* Mobile Bottom Navigation Bar \*\/}\s*<BottomNav \/>\n/, '');

// Change main content layout
c = c.replace(/<Sidebar \/>/g, '<Sidebar />\n\n        {/* Overlay for mobile sidebar */}\n        {isMobileMenuOpen && (\n          <div \n            className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm"\n            onClick={() => setIsMobileMenuOpen(false)}\n          />\n        )}');

if (!c.includes('isMobileMenuOpen')) {
  c = c.replace(/const { activeTab, toast, isAuthenticated } = useApp\(\);/, 'const { activeTab, toast, isAuthenticated, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();');
}

fs.writeFileSync('client/src/App.jsx', c);
