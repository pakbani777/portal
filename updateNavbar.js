const fs = require('fs');
let c = fs.readFileSync('client/src/components/Navbar.jsx', 'utf8');

if (!c.includes('isMobileMenuOpen')) {
  c = c.replace(/const { activeRole, setActiveRole/g, 'const { isMobileMenuOpen, setIsMobileMenuOpen, activeRole, setActiveRole');
}

if (!c.includes('Menu } from \'lucide-react\'')) {
  c = c.replace(/import { BookOpen, UserCheck, ShieldCheck, GraduationCap, Sparkles, User as UserIcon } from 'lucide-react';/g, 
    "import { BookOpen, UserCheck, ShieldCheck, GraduationCap, Sparkles, User as UserIcon, Menu, X } from 'lucide-react';");
}

// Add toggle button next to the logo
const buttonStr = `
        <button 
          className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
`;

if (!c.includes('onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}')) {
  c = c.replace(/<div className="flex items-center gap-2 md:gap-3">/, `<div className="flex items-center gap-2 md:gap-3">` + buttonStr);
}

fs.writeFileSync('client/src/components/Navbar.jsx', c);
