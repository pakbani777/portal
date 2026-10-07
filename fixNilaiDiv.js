const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

const regex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*\{activeAdminTab === 'users'/;
const newRegex = `</div>
          </div>
        </div>
      )}
      {activeAdminTab === 'users'`;

if (regex.test(code)) {
  code = code.replace(regex, newRegex);
  fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
  console.log('Fixed extra div in nilai tab');
} else {
  // Let's use string replace on the exact text
  const text = `            </div>

          </div>
        </div>

      </div>
      </div>
      )}
      {activeAdminTab === 'users'`;
  const replacement = `            </div>

          </div>
        </div>
      )}
      {activeAdminTab === 'users'`;
      
  if (code.includes(text)) {
    code = code.replace(text, replacement);
    fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
    console.log('Fixed exactly');
  } else if (code.includes(text.replace(/\n/g, '\r\n'))) {
    code = code.replace(text.replace(/\n/g, '\r\n'), replacement);
    fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
    console.log('Fixed exactly (CRLF)');
  } else {
    console.log('Regex failed');
  }
}
