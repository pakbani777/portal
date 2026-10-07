const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

code = code.replace(
  `                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowMassInput(!showMassInput)} className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-200 transition cursor-pointer">
                      Input Massal (Teks)
                    </button>
                  <button type="button" onClick={handleAddSoal} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-200 transition flex items-center gap-1 cursor-pointer">
                    <PlusCircle className="w-4 h-4" /> Tambah Soal
                  </button>
                </div>`,
  `                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowMassInput(!showMassInput)} className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-200 transition cursor-pointer">
                      Input Massal (Teks)
                    </button>
                    <button type="button" onClick={handleAddSoal} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-200 transition flex items-center gap-1 cursor-pointer">
                      <PlusCircle className="w-4 h-4" /> Tambah Soal
                    </button>
                  </div>
                </div>` // Add the missing closing div
);

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
console.log("Syntax error fixed.");
