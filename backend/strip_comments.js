const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.gemini', 'coverage'];
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

function stripComments(content) {
    const regex = /("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)|(\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/)|(\/\/.*)/gm;

    return content.replace(regex, (match, string, blockComment, lineComment) => {
        if (string) return string; 
        return ""; 
    });
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                processDirectory(fullPath);
            }
        } else if (extensions.includes(path.extname(file))) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const newContent = stripComments(content);
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Cleaned: ${fullPath}`);
            }
        }
    }
}

console.log("Starting comment cleanup...");


processDirectory(__dirname);


const frontendSrc = path.join(__dirname, '../frontend/src');
if (fs.existsSync(frontendSrc)) {
    processDirectory(frontendSrc);
}

console.log("Cleanup complete.");
