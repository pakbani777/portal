const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

// 1. In CSV export:
const exportTarget = `const rows = nilaiList.map((n, i) => [
      i + 1,
      n.tipe.toUpperCase(),
      \`"\${n.nama_siswa}"\`,`;

const exportReplacement = `const rows = nilaiList.map((n, i) => {
      let tipeJudul = n.tipe.toUpperCase();
      if (n.tipe === 'ulangan') {
        const u = ulanganList.find(ul => ul.id == n.ref_id);
        if (u) tipeJudul = \`CBT: \${u.judul}\`;
      }
      return [
      i + 1,
      \`"\${tipeJudul}"\`,
      \`"\${n.nama_siswa}"\`,`;

if (code.includes(exportTarget)) {
  code = code.replace(exportTarget, exportReplacement);
  console.log('CSV export updated');
} else {
  // Try fallback
  const exportTargetCRLF = exportTarget.replace(/\n/g, '\r\n');
  code = code.replace(exportTargetCRLF, exportReplacement);
}

// 2. In the UI table for Rekap Nilai:
const tableTarget = `<td className="py-2.5 px-3 font-bold text-slate-700">{row.nama_siswa}</td>
                        <td className="py-2.5 px-3">
                          <span className={\`text-[10px] font-bold px-2 py-1 rounded-md \${row.tipe === 'ulangan' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}\`}>
                            {row.tipe.toUpperCase()}
                          </span>
                        </td>`;

const tableReplacement = `<td className="py-2.5 px-3 font-bold text-slate-700">{row.nama_siswa}</td>
                        <td className="py-2.5 px-3">
                          <span className={\`text-[10px] font-bold px-2 py-1 rounded-md \${row.tipe === 'ulangan' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}\`}>
                            {row.tipe === 'ulangan' ? (() => {
                              const u = ulanganList.find(ul => ul.id == row.ref_id);
                              return u ? \`CBT: \${u.judul}\` : 'CBT';
                            })() : row.tipe.toUpperCase()}
                          </span>
                        </td>`;

if (code.includes(tableTarget)) {
  code = code.replace(tableTarget, tableReplacement);
  console.log('UI table updated');
} else {
  const tableTargetCRLF = tableTarget.replace(/\n/g, '\r\n');
  code = code.replace(tableTargetCRLF, tableReplacement);
}

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
console.log('GuruAdminPage fixed');
