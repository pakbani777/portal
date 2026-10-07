const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

const target = `      n.jawaban_benar,
      n.total_soal,
      \`"\${n.waktu_selesai}"\`
    ]);

    const csvContent`;

const replacement = `      n.jawaban_benar,
      n.total_soal,
      \`"\${n.waktu_selesai}"\`
    ];
    });

    const csvContent`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
  console.log('Fixed export syntax error');
} else {
  // Try regex
  const regex = /`"\$\{n\.waktu_selesai\}"`\s*\]\);\s*const csvContent/;
  if (regex.test(code)) {
    code = code.replace(regex, '`"${n.waktu_selesai}"`\n    ];\n    });\n\n    const csvContent');
    fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
    console.log('Fixed export syntax error via regex');
  } else {
    console.log('Could not find target');
  }
}
