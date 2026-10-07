const fs = require('fs');
let code = fs.readFileSync('client/src/App.jsx', 'utf8');

if (!code.includes('ErrorBoundary')) {
  code = code.replace("import React from 'react';", "import React from 'react';\nimport { ErrorBoundary } from './components/ErrorBoundary';");
  
  code = code.replace(
    "export default function App() {\n  return (\n    <AppProvider>\n      <MainContent />\n    </AppProvider>\n  );\n}",
    "export default function App() {\n  return (\n    <ErrorBoundary>\n      <AppProvider>\n        <MainContent />\n      </AppProvider>\n    </ErrorBoundary>\n  );\n}"
  );
  
  fs.writeFileSync('client/src/App.jsx', code);
}
