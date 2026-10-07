const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Dashboard.jsx', 'utf8');

const startMarker = 'stats.tugasTerbaru.map((j) => (';
const endMarker = 'Tidak ada tugas yang menunggu.';
let startIndex = code.indexOf(startMarker);
let endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `stats.tugasTerbaru.map((j) => (
                  <div
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
                ))
              ) : (
                <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                  `;
  code = code.substring(0, startIndex) + replacement + code.substring(endIndex + endMarker.length);
  fs.writeFileSync('client/src/pages/Dashboard.jsx', code);
  console.log("Replaced successfully!");
} else {
  console.log("Markers not found");
}
