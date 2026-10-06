const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

code = code.replace(
  "const { judul, deskripsi, deadline, kelas } = req.body;\n    const { data: inserted, error } = await supabase.from('tugas').insert([{\n      judul, deskripsi, deadline, kelas: String(kelas)\n    }]).select();",
  "const { judul, deskripsi, deadline, kelas, link_tugas } = req.body;\n    const { data: inserted, error } = await supabase.from('tugas').insert([{\n      judul, deskripsi, deadline, kelas: String(kelas), link_tugas\n    }]).select();"
);

fs.writeFileSync('server/index.js', code);
