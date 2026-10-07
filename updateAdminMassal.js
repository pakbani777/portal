const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

// 1. Update initial state & handleAddSoal
code = code.replace(
  "{ id: 'q1', pertanyaan: '', pilihan: ['', '', '', ''], kunci: 0 }",
  "{ id: 'q1', pertanyaan: '', pilihan: ['', '', '', ''], kunci: 0, bobot: 1 }"
);
code = code.replace(
  "setSoalList([{ id: 'q1', pertanyaan: '', pilihan: ['', '', '', ''], kunci: 0 }]);",
  "setSoalList([{ id: 'q1', pertanyaan: '', pilihan: ['', '', '', ''], kunci: 0, bobot: 1 }]);"
);
code = code.replace(
  "setSoalList([...soalList, { id: 'q' + Date.now(), pertanyaan: '', pilihan: ['', '', '', ''], kunci: 0 }]);",
  "setSoalList([...soalList, { id: 'q' + Date.now(), pertanyaan: '', pilihan: ['', '', '', ''], kunci: 0, bobot: 1 }]);"
);

// 2. Add Mass Input logic
const massInputLogic = `
  const [showMassInput, setShowMassInput] = useState(false);
  const [massText, setMassText] = useState('');

  const handleParseMassal = () => {
    if (!massText.trim()) return showToast('Teks kosong!');
    
    const blocks = massText.split(/\\n(?=\\d+\\.)/).map(b => b.trim()).filter(b => b);
    const newSoalArray = [];
    
    for (let i = 0; i < blocks.length; i++) {
      const lines = blocks[i].split('\\n').map(l => l.trim()).filter(l => l);
      if (lines.length < 5) continue;
      
      const qText = lines[0].replace(/^\\d+\\.\\s*/, '');
      const opts = ['', '', '', ''];
      let kunciIdx = 0;
      let bobotVal = 1;
      
      let optCount = 0;
      for (let j = 1; j < lines.length; j++) {
        const lower = lines[j].toLowerCase();
        if (lower.startsWith('a.') || lower.startsWith('a)')) { opts[0] = lines[j].substring(2).trim(); optCount++; }
        else if (lower.startsWith('b.') || lower.startsWith('b)')) { opts[1] = lines[j].substring(2).trim(); optCount++; }
        else if (lower.startsWith('c.') || lower.startsWith('c)')) { opts[2] = lines[j].substring(2).trim(); optCount++; }
        else if (lower.startsWith('d.') || lower.startsWith('d)')) { opts[3] = lines[j].substring(2).trim(); optCount++; }
        else if (lower.startsWith('kunci:')) {
          const kStr = lower.replace('kunci:', '').trim();
          if (kStr === 'a') kunciIdx = 0;
          if (kStr === 'b') kunciIdx = 1;
          if (kStr === 'c') kunciIdx = 2;
          if (kStr === 'd') kunciIdx = 3;
        }
        else if (lower.startsWith('bobot:')) {
          const bVal = parseInt(lower.replace('bobot:', '').trim());
          if (!isNaN(bVal)) bobotVal = bVal;
        }
      }
      
      newSoalArray.push({
        id: 'qm' + Date.now() + i,
        pertanyaan: qText,
        pilihan: opts,
        kunci: kunciIdx,
        bobot: bobotVal
      });
    }
    
    if (newSoalArray.length > 0) {
      setSoalList(newSoalArray);
      setShowMassInput(false);
      setMassText('');
      showToast(\`Berhasil memproses \${newSoalArray.length} soal!\`);
      sounds.playSuccess();
    } else {
      showToast('Gagal memproses teks. Pastikan format benar.', 'error');
    }
  };
`;

const marker1 = "const handleAddSoal = () => {";
if (!code.includes("handleParseMassal")) {
  code = code.replace(marker1, massInputLogic + "\n  " + marker1);
}

// 3. Add UI for Mass Input button & UI for Bobot
const marker2 = `<h3 className="text-sm font-bold text-slate-800">Daftar Soal Pilihan Ganda</h3>`;
const replace2 = `<h3 className="text-sm font-bold text-slate-800">Daftar Soal Pilihan Ganda</h3>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowMassInput(!showMassInput)} className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-200 transition cursor-pointer">
                      Input Massal (Teks)
                    </button>`;

if (!code.includes("Input Massal (Teks)")) {
  code = code.replace(marker2, replace2);
}

const marker3 = `{soalList.map((soal, sIdx) => (`;
const replace3 = `
                {showMassInput && (
                  <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-2xl">
                    <h4 className="text-xs font-bold text-purple-800 mb-2">Format Input Massal:</h4>
                    <pre className="text-[10px] text-purple-700 bg-white p-2 rounded-lg mb-3 font-mono">
{codeFormatExample}
                    </pre>
                    <textarea 
                      rows="6" 
                      value={massText}
                      onChange={e => setMassText(e.target.value)}
                      placeholder="Paste soal di sini..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-purple-300 text-sm mb-2"
                    />
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setShowMassInput(false)} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Batal</button>
                      <button type="button" onClick={handleParseMassal} className="px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg">Proses Soal</button>
                    </div>
                  </div>
                )}
                {soalList.map((soal, sIdx) => (`;

const codeFormatExample = `1. Pertanyaan pertama
A. Opsi A
B. Opsi B
C. Opsi C
D. Opsi D
Kunci: A
Bobot: 2`;

if (!code.includes("Format Input Massal:")) {
  code = code.replace(marker3, replace3.replace('{codeFormatExample}', codeFormatExample));
}

// 4. Update the Soal UI to include Bobot
const marker4 = `<label className="block text-xs font-bold text-slate-700 mb-1">Soal No. {sIdx + 1}</label>`;
const replace4 = `<div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-bold text-slate-700">Soal No. {sIdx + 1}</label>
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] font-bold text-slate-500">Bobot Nilai:</label>
                            <input type="number" min="1" value={soal.bobot || 1} onChange={e => handleSoalChange(sIdx, 'bobot', parseInt(e.target.value) || 1)} className="w-14 px-2 py-0.5 rounded-md border text-xs text-center font-bold text-blue-700" />
                          </div>
                        </div>`;

if (!code.includes("Bobot Nilai:")) {
  code = code.replace(marker4, replace4);
}

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
console.log("Updated GuruAdminPage with Massal Input and Bobot");
