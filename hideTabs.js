const fs = require('fs');
const path = require('path');

const files = [
  'client/src/pages/AbsensiPage.jsx',
  'client/src/pages/JadwalPage.jsx',
  'client/src/pages/KuisPage.jsx',
  'client/src/pages/MateriPage.jsx',
  'client/src/pages/UlanganPage.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Add currentUser to useApp() destructuring if it doesn't exist
  if (!content.includes('currentUser,')) {
    content = content.replace(/const { ([^}]+) } = useApp\(\);/, 'const { currentUser, $1 } = useApp();');
  }

  // 2. Wrap the class tabs block with currentUser check
  // The block looks like: <div className="flex items-center bg-slate-100 ...">\n {['7', '8', '9']
  // We need to wrap it safely.
  const regex = /(<div className="[^"]*bg-slate-100[^"]*self-start[^"]*">[\s\S]*?\{\['7', '8', '9'\][\s\S]*?<\/div>)/g;
  
  if (content.match(regex)) {
    content = content.replace(regex, "{currentUser?.role !== 'siswa' && ($1)}");
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`Failed to match regex in ${file}`);
  }
});
