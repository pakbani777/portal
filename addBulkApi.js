const fs = require('fs');
let c = fs.readFileSync('client/src/services/api.js', 'utf8');

c += `\nexport const createBulkUsers = async (data) => {\n  const res = await fetch(\`\${API_BASE_URL}/api/users/bulk\`, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(data),\n  });\n  return res.json();\n};\n`;

fs.writeFileSync('client/src/services/api.js', c);
