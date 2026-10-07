const fs = require('fs');
let code = fs.readFileSync('client/src/App.jsx', 'utf8');

const target = '    <AppProvider>\n      <MainContent />\n    </AppProvider>';
const replacement = '    <ErrorBoundary>\n      <AppProvider>\n        <MainContent />\n      </AppProvider>\n    </ErrorBoundary>';
code = code.replace(target, replacement);

fs.writeFileSync('client/src/App.jsx', code);
