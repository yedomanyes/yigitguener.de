// patch-fonts.js - Adds Poppins font import to all article HTML files
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname);
const skip = ['admin.html', 'anmelden.html', 'kontakt.html', 'impressum.html', 'datenschutz.html'];
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !skip.includes(f));

const fontLink = `    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">`;
const fontStyle = `    <style>body,h1,h2,h3,h4,p,a,span,div,li,td,input,button{font-family:'Poppins',sans-serif!important}</style>`;

let patched = 0;
files.forEach(file => {
    const fp = path.join(dir, file);
    let content = fs.readFileSync(fp, 'utf8');
    if (!content.includes('Poppins')) {
        content = content.replace('</head>', fontLink + '\n' + fontStyle + '\n</head>');
        fs.writeFileSync(fp, content, 'utf8');
        patched++;
        console.log('Patched:', file);
    } else {
        console.log('Already has Poppins:', file);
    }
});
console.log('Done. Patched', patched, 'files.');
