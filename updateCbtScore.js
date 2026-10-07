const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

const oldLogic = `    const item = items[0];
    const soalList = typeof item.soal_json === 'string' ? JSON.parse(item.soal_json) : item.soal_json;
    let jawabanBenar = 0;
    const totalSoal = soalList.length;

    const evaluasi = soalList.map((s) => {
      const userAns = jawaban[s.id] !== undefined ? jawaban[s.id] : -1;
      const isCorrect = userAns === s.kunci;
      if (isCorrect) jawabanBenar++;
      return {
        id: s.id,
        pertanyaan: s.pertanyaan,
        pilihan: s.pilihan,
        jawabanUser: userAns,
        kunciJawaban: s.kunci,
        benar: isCorrect
      };
    });

    const skor = Math.round((jawabanBenar / totalSoal) * 100);`;

const newLogic = `    const item = items[0];
    const soalList = typeof item.soal_json === 'string' ? JSON.parse(item.soal_json) : item.soal_json;
    let jawabanBenar = 0;
    let totalBobot = 0;
    let skorDiperoleh = 0;
    const totalSoal = soalList.length;

    const evaluasi = soalList.map((s) => {
      const userAns = jawaban[s.id] !== undefined ? jawaban[s.id] : -1;
      const isCorrect = userAns === s.kunci;
      const bobot = typeof s.bobot === 'number' ? s.bobot : 1;
      
      totalBobot += bobot;
      
      if (isCorrect) {
        jawabanBenar++;
        skorDiperoleh += bobot;
      }
      return {
        id: s.id,
        pertanyaan: s.pertanyaan,
        pilihan: s.pilihan,
        jawabanUser: userAns,
        kunciJawaban: s.kunci,
        benar: isCorrect,
        bobot: bobot
      };
    });

    const skor = totalBobot > 0 ? Math.round((skorDiperoleh / totalBobot) * 100) : 0;`;

if (code.includes('if (isCorrect) jawabanBenar++;')) {
  code = code.replace(oldLogic, newLogic);
  fs.writeFileSync('server/index.js', code);
  console.log("Updated POST /api/ulangan/submit logic for bobot.");
} else {
  console.log("Could not find the target code in server/index.js.");
}
