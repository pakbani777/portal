const fs = require('fs');
let code = fs.readFileSync('client/src/pages/UlanganPage.jsx', 'utf8');

const oldCardEnd = `                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {u.judul}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  10 Butir Soal Terstandar Asesmen PAI Kemendikbud
                </p>
              </div>

              <div className="mt-5">
                <button
                  onClick={() => handleOpenTokenModal(u)}
                  className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <KeyRound className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Kerjakan Sekarang
                </button>
              </div>
            </div>`;

const newCardEnd = `                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {u.judul}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {u.total_soal} Butir Soal Terstandar Asesmen PAI Kemendikbud
                </p>
              </div>

              <div className="mt-5">
                {u.sudah_dikerjakan ? (
                  <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-green-50 text-green-700 border border-green-200">
                    <span className="text-xs font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Selesai Dikerjakan</span>
                    <span className="text-sm font-black bg-green-600 text-white px-2 py-0.5 rounded-md">{u.skor_terakhir}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenTokenModal(u)}
                    className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <KeyRound className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Kerjakan Sekarang
                  </button>
                )}
              </div>
            </div>`;

if (code.includes('10 Butir Soal Terstandar')) {
  code = code.replace(oldCardEnd, newCardEnd);
  fs.writeFileSync('client/src/pages/UlanganPage.jsx', code);
  console.log("Card UI updated.");
} else {
  console.log("Could not find the target code in UlanganPage.jsx");
}
