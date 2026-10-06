const fs = require('fs');
let code = fs.readFileSync('client/src/services/api.js', 'utf8');

const apiUpdates = `
export const fetchTugas = async (kelas = 'all') => {
  const res = await fetch(\`\${API_BASE_URL}/api/tugas?kelas=\${kelas}\`);
  return res.json();
};

export const createTugas = async (data) => {
  const res = await fetch(\`\${API_BASE_URL}/api/tugas\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const submitTugas = async (tugasId, data) => {
  const res = await fetch(\`\${API_BASE_URL}/api/tugas/\${tugasId}/submit\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const fetchTugasSubmissions = async (tugasId) => {
  const res = await fetch(\`\${API_BASE_URL}/api/tugas/\${tugasId}/submissions\`);
  return res.json();
};
`;

code += "\n" + apiUpdates;
fs.writeFileSync('client/src/services/api.js', code);
