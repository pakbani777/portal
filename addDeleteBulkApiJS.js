const fs = require('fs');
let code = fs.readFileSync('client/src/services/api.js', 'utf8');

if (!code.includes('export const deleteBulkUsers')) {
  code += `\nexport const deleteBulkUsers = async (ids) => {
  const res = await fetch(\`\${API_BASE_URL}/api/users/delete-bulk\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  });
  return res.json();
};\n`;
  fs.writeFileSync('client/src/services/api.js', code);
  console.log('Added deleteBulkUsers to api.js');
}
