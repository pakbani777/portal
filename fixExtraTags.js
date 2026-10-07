const fs = require('fs');
let code = fs.readFileSync('client/src/pages/GuruAdminPage.jsx', 'utf8');

const regexExtra = /<\/form>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}/;
const newExtra = `</form>
          </div>
        </div>
      )}`;

if (regexExtra.test(code)) {
  code = code.replace(regexExtra, newExtra);
  fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
  console.log('Fixed extra closing tags');
} else {
  // Let's just use exact match
  const match = `            </form>
          </div>
        </div>

        </div>
          </div>
        </div>
      )}`;
  const replacement = `            </form>
          </div>
        </div>
      )}`;
  if (code.includes(match)) {
    code = code.replace(match, replacement);
    fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
    console.log('Fixed exactly');
  } else {
    // maybe \r\n
    if (code.includes(match.replace(/\n/g, '\r\n'))) {
      code = code.replace(match.replace(/\n/g, '\r\n'), replacement);
      fs.writeFileSync('client/src/pages/GuruAdminPage.jsx', code);
      console.log('Fixed exactly (CRLF)');
    } else {
      console.log('Regex failed');
    }
  }
}
