const fs = require('fs');
let c = fs.readFileSync('client/src/components/Sidebar.jsx', 'utf8');

if (!c.includes('isMobileMenuOpen')) {
  c = c.replace(/const { activeTab, setActiveTab, currentUser } = useApp\(\);/, 'const { activeTab, setActiveTab, currentUser, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();');
}

c = c.replace(/<aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200\/80 p-4 sticky top-16 h-\[calc\(100vh-4rem\)\]">/g, 
  `<aside className={\`
      fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200/80 p-4 flex flex-col transition-transform duration-300 ease-in-out
      \${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
    \`}>`);

// Make clicking a menu item close the sidebar on mobile
c = c.replace(/setActiveTab\(item\.id\);\n\s*}}/g, "setActiveTab(item.id);\n                  setIsMobileMenuOpen(false);\n                }}");

fs.writeFileSync('client/src/components/Sidebar.jsx', c);
