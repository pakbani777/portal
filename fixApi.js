const fs = require('fs');
let c = fs.readFileSync('client/src/services/api.js', 'utf8');

c = c.replace(/fetch\(\$\{API_BASE_URL\}\/api\/pengumuman, \{/g, "fetch(`${API_BASE_URL}/api/pengumuman`, {");
c = c.replace(/fetch\(\$\{API_BASE_URL\}\/api\/users, \{/g, "fetch(`${API_BASE_URL}/api/users`, {");

fs.writeFileSync('client/src/services/api.js', c);
