const fs = require('fs');

// Extract all <style> blocks from index.html and foerderungen.html
let indexContent = fs.readFileSync('index.html', 'utf8');
let foerdContent = fs.readFileSync('foerderungen.html', 'utf8');
let cssToAppend = '\n/* ── Extracted from index.html & foerderungen.html ── */\n';

const styleMatch1 = indexContent.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch1) {
    cssToAppend += styleMatch1[1] + '\n';
    indexContent = indexContent.replace(styleMatch1[0], '<link rel="stylesheet" href="index.css">');
}

const styleMatch2 = foerdContent.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch2) {
    // Only append if not already appended to avoid identical duplicate blocks from user's manual copying
    // foerderungen.html had 600 lines of CSS inline. 
    cssToAppend += styleMatch2[1] + '\n';
    foerdContent = foerdContent.replace(styleMatch2[0], '<link rel="stylesheet" href="index.css">');
}

// Write HTML files WITHOUT inline styles
fs.writeFileSync('index.html', indexContent, 'utf8');
fs.writeFileSync('foerderungen.html', foerdContent, 'utf8');

// Append to index.css
let indexCss = fs.readFileSync('index.css', 'utf8');
if (!indexCss.includes('Extracted from index.html')) {
    fs.appendFileSync('index.css', cssToAppend, 'utf8');
}

console.log("CSS unification complete");
