const fs = require('fs');
let code = fs.readFileSync('client/src/services/api.js', 'utf8');

const newApi = `
export async function createUlangan(data) {
  const res = await fetch(\`\${BASE_URL}/ulangan\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
`;

if (!code.includes("export async function createUlangan")) {
  code += newApi;
  fs.writeFileSync('client/src/services/api.js', code);
  console.log("createUlangan API added.");
}
