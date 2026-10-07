const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

code = code.replace(
  "eq('ulangan_id', ulangan_id)",
  "eq('ref_id', ulangan_id).eq('tipe', 'ulangan')"
);

fs.writeFileSync('server/index.js', code);
console.log('Fixed ref_id error in submit CBT');
