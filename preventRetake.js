const fs = require('fs');
let code = fs.readFileSync('client/src/pages/UlanganPage.jsx', 'utf8');

const oldButtonBlock = `              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => handleOpenTokenModal(u)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-800/20 transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Masukkan Token Ujian
                </button>
              </div>`;

const newButtonBlock = `              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end">
                {u.sudah_dikerjakan ? (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-50 text-green-700 text-xs font-bold border border-green-200">
                    Selesai Dikerjakan (Skor: {u.skor_terakhir})
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenTokenModal(u)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-800/20 transition-all cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" /> Masukkan Token Ujian
                  </button>
                )}
              </div>`;

if (code.includes('onClick={() => handleOpenTokenModal(u)}')) {
  // Try exact match first
  if (code.includes(oldButtonBlock)) {
    code = code.replace(oldButtonBlock, newButtonBlock);
    console.log("Replaced exactly");
  } else {
    // Regex fallback
    code = code.replace(
      /<div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end">[\s\S]*?<KeyRound className="w-3\.5 h-3\.5" \/> Masukkan Token Ujian\s*<\/button>\s*<\/div>/,
      newButtonBlock
    );
    console.log("Replaced with regex");
  }
  fs.writeFileSync('client/src/pages/UlanganPage.jsx', code);
}
