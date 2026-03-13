const fs = require('fs');
const file = 'studienfoerderung.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/– – /g, '    ');
content = content.replace(/– /g, '  ');

content = content.replace(/\uFFFD*x\}/g, '🎓');
content = content.replace(/\uFFFD*x &/g, '🗓');
content = content.replace(/\uFFFD*x\u00A0&/g, '🗓');
content = content.replace(/\uFFFD*x:️/g, '🏛️');
content = content.replace(/Sberblick/g, 'Überblick');
content = content.replace(/992  \/Monat/g, '992 €/Monat');
content = content.replace(/992\u00A0\u00A0\/Monat/g, '992 €/Monat');
content = content.replace(/\uFFFD/g, '');

content = content.replace(/class="btn btn--accent/g, 'class="btn btn--affiliate');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed studienfoerderung.html');
