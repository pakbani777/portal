const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

// We will inject a helper component or logic inside GuruAdminPage, or just replace the specific sections.
// It's easiest to write a robust regex to replace the entire export function and table.

const exportTarget = `const handleExportNilaiCSV = () => {`;
const newExport = `const handleExportNilaiCSV = () => {
    sounds.playClick();
    if (nilaiList.length === 0) {
      showToast('Tidak ada data nilai untuk diekspor', 'error');
      return;
    }

    // Bangun Matriks Nilai
    const uniqueTests = [];
    nilaiList.forEach(n => {
      const key = \`\${n.tipe}_\${n.ref_id}\`;
      if (!uniqueTests.find(t => t.key === key)) {
         let judul = n.tipe;
         if (n.tipe === 'ulangan') {
           const u = ulanganList.find(ul => ul.id == n.ref_id);
           if (u) judul = \`CBT: \${u.judul}\`;
         }
         uniqueTests.push({ key, judul });
      }
    });

    const studentsMap = {};
    nilaiList.forEach(n => {
      if (!studentsMap[n.nama_siswa]) {
        studentsMap[n.nama_siswa] = {};
      }
      const key = \`\${n.tipe}_\${n.ref_id}\`;
      studentsMap[n.nama_siswa][key] = n.skor;
    });
    const students = Object.keys(studentsMap).sort();

    const headers = ['No', 'Nama Siswa', 'Kelas', ...uniqueTests.map(t => \`"\${t.judul}"\`)];
    const rows = students.map((nama, i) => {
      const row = [i + 1, \`"\${nama}"\`, activeKelas];
      uniqueTests.forEach(t => {
        const skor = studentsMap[nama][t.key];
        row.push(skor !== undefined ? skor : '-');
      });
      return row;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', \`Buku_Nilai_PAI_PakBani_Kelas_\${activeKelas}.csv\`);
    document.body.appendChild(link);
    link.click();
    showToast('Buku nilai siswa berhasil diunduh! 📚');
  };`;

const exportRegex = /const handleExportNilaiCSV = \(\) => \{[\s\S]*?showToast\('Buku nilai siswa berhasil diunduh! .*?'\);\s*\};/;

if (exportRegex.test(code)) {
  code = code.replace(exportRegex, newExport);
  console.log('Replaced CSV Export');
} else {
  console.log('Failed to match CSV Export');
}

// Now replace the table UI with a Matrix UI
const tableRegex = /\{\/\* Tabel Nilai \*\/\}[\s\S]*?<\/table>\s*<\/div>/;

const newTable = `{/* Tabel Nilai (Format Matriks) */}
            <div className="overflow-x-auto">
              {(() => {
                const uniqueTests = [];
                nilaiList.forEach(n => {
                  const key = \`\${n.tipe}_\${n.ref_id}\`;
                  if (!uniqueTests.find(t => t.key === key)) {
                     let judul = n.tipe;
                     if (n.tipe === 'ulangan') {
                       const u = ulanganList.find(ul => ul.id == n.ref_id);
                       if (u) judul = \`\${u.judul}\`;
                     }
                     uniqueTests.push({ key, judul });
                  }
                });

                const studentsMap = {};
                nilaiList.forEach(n => {
                  if (!studentsMap[n.nama_siswa]) {
                    studentsMap[n.nama_siswa] = {};
                  }
                  const key = \`\${n.tipe}_\${n.ref_id}\`;
                  studentsMap[n.nama_siswa][key] = n.skor;
                });
                const students = Object.keys(studentsMap).sort();

                return (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5 px-3 min-w-[150px] sticky left-0 bg-white shadow-[1px_0_0_#e2e8f0]">Nama Siswa</th>
                        {uniqueTests.map((t, idx) => (
                          <th key={idx} className="py-2.5 px-3 text-center whitespace-nowrap min-w-[100px] border-l border-slate-100">
                            {t.judul}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr>
                          <td colSpan={uniqueTests.length + 1} className="py-8 text-center text-slate-400">
                            Memuat rekap nilai...
                          </td>
                        </tr>
                      ) : students.length > 0 ? (
                        students.map((nama, i) => (
                          <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-700 sticky left-0 bg-white shadow-[1px_0_0_#e2e8f0] truncate max-w-[150px]">
                              {nama}
                            </td>
                            {uniqueTests.map((t, idx) => {
                              const skor = studentsMap[nama][t.key];
                              return (
                                <td key={idx} className="py-2.5 px-3 text-center font-semibold text-slate-600 border-l border-slate-50">
                                  {skor !== undefined ? (
                                    <span className={\`px-2 py-1 rounded-md \${skor >= 75 ? 'text-green-700 bg-green-50' : 'text-rose-700 bg-rose-50'}\`}>
                                      {skor}
                                    </span>
                                  ) : (
                                    <span className="text-slate-300">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={10} className="py-8 text-center text-slate-400 italic">
                            Belum ada rekap nilai untuk kelas ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                );
              })()}
            </div>`;

if (tableRegex.test(code)) {
  code = code.replace(tableRegex, newTable);
  console.log('Replaced Table UI');
} else {
  console.log('Failed to match Table UI');
}

fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
console.log('GuruAdminPage updated with Matrix format');
