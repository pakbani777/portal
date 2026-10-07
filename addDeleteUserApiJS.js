const fs = require('fs');
let code = fs.readFileSync('client/src/services/api.js', 'utf8');

if (!code.includes('export const deleteUser')) {
  code += `\nexport const deleteUser = async (id) => {
  const res = await fetch(\`\${API_BASE_URL}/api/users/\${id}\`, { method: 'DELETE' });
  return res.json();
};\n`;
  fs.writeFileSync('client/src/services/api.js', code);
  console.log('Added deleteUser to api.js');
}
