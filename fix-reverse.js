const fs = require('fs');
const path = require('path');
const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(path.join(dir, f), 'utf8');
  let original = content;

  // Reverse the damage
  content = content.replace(/€/g, ' '); 
  content = content.replace(/≥/g, '0');
  content = content.replace(/🏗️ /g, 'x'); // it was 'x' -> '🏗️ '
  content = content.replace(/💡 /g, 'x '); // 'x ' -> '💡 '
  content = content.replace(/🌱 /g, 'a ');

  if (content !== original) {
    fs.writeFileSync(path.join(dir, f), content, 'utf8');
    console.log('Fixed back ' + f);
  }
});
console.log('Reverse script completed.');
