const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
// add jsx support
const jsx = require('acorn-jsx');
const Parser = acorn.Parser.extend(jsx());

function checkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            checkDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            try {
                Parser.parse(content, { sourceType: 'module', ecmaVersion: 2020 });
            } catch (err) {
                console.error(`Syntax Error in ${fullPath}:`, err.message);
            }
        }
    }
}

console.log("Checking syntax...");
checkDir(path.join(__dirname, 'frontend/app'));
console.log("Done.");
