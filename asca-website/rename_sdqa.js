const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const srcDir = path.join(__dirname, 'src');

walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(/SDQA/g, 'SDQu').replace(/sdqa/g, 'sdqu');
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});

const oldDir = path.join(srcDir, 'app', 'admin', 'pendaftar-sdqa');
const newDir = path.join(srcDir, 'app', 'admin', 'pendaftar-sdqu');
if (fs.existsSync(oldDir)) {
    fs.renameSync(oldDir, newDir);
    console.log(`Renamed ${oldDir} to ${newDir}`);
}
