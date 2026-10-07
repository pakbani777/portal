const fs = require('fs');
let code = fs.readFileSync('client/src/components/UserManagement.jsx', 'utf8');

if (!code.includes("import { createBulkUsers")) {
  code = code.replace(
    "import { API_BASE_URL } from '../config';",
    "import { API_BASE_URL } from '../config';\nimport { createBulkUsers } from '../services/api';"
  );
  fs.writeFileSync('client/src/components/UserManagement.jsx', code);
  console.log("Fixed import");
}
