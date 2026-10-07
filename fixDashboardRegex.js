const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Dashboard.jsx', 'utf8');

const regexToReplace = /<div\s+key=\{j\.id\}[\s\S]*?Cek Presensi\n\s*<\/button>\n\s*<\/div>\n\s*<\/div>\n\s*\)\)/;

const newCard = `<div
                    key={j.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{j.judul}</h4>
                        <p className="text-xs text-slate-500 font-medium">Batas Waktu: {j.deadline ? new Date(j.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</p>
                      </div>
                    </div>
                  </div>
                ))`;

code = code.replace(regexToReplace, newCard);

fs.writeFileSync('client/src/pages/Dashboard.jsx', code);
