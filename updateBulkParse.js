const fs = require('fs');
let code = fs.readFileSync('client/src/components/UserManagement.jsx', 'utf8');

const oldParse = `    // Parse paste data (NISN, Nama)
    const lines = bulkForm.rawData.split('\\n').map(l => l.trim()).filter(l => l);
    const usersData = lines.map(line => {
      // support tab or comma separation
      const parts = line.split(/[\\t,]+/).map(p => p.trim());
      if (parts.length >= 2) {
        return { nisn: parts[0], nama: parts.slice(1).join(' ') };
      } else {
        return { nisn: '', nama: parts[0] };
      }
    });`;

const newParse = `    // Parse paste data (hanya Nama Lengkap, abaikan kolom lain)
    const lines = bulkForm.rawData.split('\\n').map(l => l.trim()).filter(l => l);
    const usersData = lines.map(line => {
      // Hilangkan angka/nomor di awal baris jika ada (misal "1. Budi" menjadi "Budi")
      const cleanName = line.replace(/^\\d+[\\.\\t]+\\s*/, '').replace(/^\\d+\\s+/, '').trim();
      return { nisn: '', nama: cleanName || line };
    });`;

if (code.includes('const parts = line.split(/[\\t,]+/).map(p => p.trim());')) {
  code = code.replace(oldParse, newParse);
  fs.writeFileSync('client/src/components/UserManagement.jsx', code);
  console.log("Updated parsing logic in UserManagement.jsx");
} else {
  console.log("Could not find parsing logic");
}
