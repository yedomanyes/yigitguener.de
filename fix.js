const fs = require('fs');
const file = 'studienfoerderung.html';
let content = fs.readFileSync(file, 'utf8');

// Fix spacing issues from earlier script
content = content.replace(/– – /g, '    ');
content = content.replace(/– /g, '  ');

// Fix specific emojis (replace anything matching 'x}' or similar including the replacement character \uFFFD)
content = content.replace(/\uFFFD*x\}/g, '🎓');
content = content.replace(/\uFFFD*x &/g, '🗓');
content = content.replace(/\uFFFD*x\u00A0&/g, '🗓'); // non-breaking space variant
content = content.replace(/\uFFFD*x:️/g, '🏛️');
content = content.replace(/\uFFFD*x:️/g, '🏛️');
content = content.replace(/Sberblick/g, 'Überblick');
content = content.replace(/992  \/Monat/g, '992 €/Monat');
content = content.replace(/992  \/Monat/g, '992 €/Monat');
content = content.replace(/x/g, ''); // cleanup any stray bad chars
content = content.replace(/ /g, ' '); // cleanup
content = content.replace(//g, ''); // complete wipe of bad replacement chars

// affiliate button
content = content.replace(/class="btn btn--accent w-full/g, 'class="btn btn--affiliate w-full');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed studienfoerderung.html');
