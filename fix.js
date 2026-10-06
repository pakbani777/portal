const fs = require('fs');
let c = fs.readFileSync('server/index.js', 'utf8');
c = c.replace(/app\.get\('\*',/g, "app.get('/(.*)',");
c = c.replace(/app\.all\('\*',/g, "app.all('/(.*)',");
fs.writeFileSync('server/index.js', c);
