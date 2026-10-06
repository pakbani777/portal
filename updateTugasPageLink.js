const fs = require('fs');
let code = fs.readFileSync('client/src/pages/TugasPage.jsx', 'utf8');

// Replace button with anchor
const newButton = `
                  <a
                    href={tugas.link_tugas || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sounds.playClick()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Kumpulkan Tugas
                  </a>
`;

code = code.replace(
  /<button[\s\S]*?handleUploadClick\(tugas\)[\s\S]*?<\/button>/,
  newButton
);

// Remove Modal
code = code.replace(/{\/\* Modal Upload \*\/}[\s\S]*?}\)/, '');

fs.writeFileSync('client/src/pages/TugasPage.jsx', code);
