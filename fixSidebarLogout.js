const fs = require('fs');
let c = fs.readFileSync('client/src/components/Sidebar.jsx', 'utf8');

if (!c.includes('LogOut } from \'lucide-react\'')) {
  c = c.replace(/import {([^}]+)} from 'lucide-react';/, "import {$1, LogOut} from 'lucide-react';");
}

if (!c.includes('logout } = useApp()')) {
  c = c.replace(/const { activeTab, setActiveTab, activeRole, activeKelas, isMobileMenuOpen, setIsMobileMenuOpen } = useApp\(\);/, 'const { activeTab, setActiveTab, activeRole, activeKelas, isMobileMenuOpen, setIsMobileMenuOpen, logout } = useApp();');
}

const logoutBtn = `
      {/* Tombol Logout (Mobile) */}
      <div className="md:hidden mt-3 p-3 pt-0">
        <button 
          onClick={() => {
            setIsMobileMenuOpen(false);
            logout();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar (Logout)
        </button>
      </div>
`;

if (!c.includes('Tombol Logout (Mobile)')) {
  c = c.replace(/(<div className="mt-auto p-3\.5 rounded-2xl)/, logoutBtn + '\n      $1');
}

fs.writeFileSync('client/src/components/Sidebar.jsx', c);
