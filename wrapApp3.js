const fs = require('fs');
let code = fs.readFileSync('client/src/App.jsx', 'utf8');

code = code.replace(
  /<AppProvider>\s*<MainContent \/>\s*<\/AppProvider>/,
  "<ErrorBoundary>\n      <AppProvider>\n        <MainContent />\n      </AppProvider>\n    </ErrorBoundary>"
);

fs.writeFileSync('client/src/App.jsx', code);
