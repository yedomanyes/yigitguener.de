const fs = require('fs');
const path = require('path');
const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(path.join(dir, f), 'utf8');
  let original = content;

  // Revert the bad replacements from the global script:
  // "– " became "  "
  // "€" became " "
  // "x" became "🏠"
  // "🎓" was replaced back from "x}" but it might have been "x }" originally in the bad script? No.
  
  // Actually, the quickest way to fix the HTML files is to read them from git if it's a repo, but git isn't here.
  // Wait, let's just do a clean fix:
  content = content.replace(/– – /g, '    ');
  content = content.replace(/– /g, '  ');
  content = content.replace(/🏠/g, 'x'); // Fix the Xs that became houses
  
  // Emojis that were broken before:
  // "a " -> "🌱 "
  // "x " -> "💡 "
  // "x" -> "🏗️ "
  // "x:️" -> "🏛️ "
  // "x &" -> "🗓"
  // "x} " -> "🎓 "
  // "a️" -> "⚠️"

  const fixes = {
      'a ': '🌱 ',
      'x ': '💡 ',
      'x': '🏗️ ',
      'x:️': '🏛️ ',
      'x &': '🗓 ',
      'x} ': '🎓 ',
      'a️': '⚠️ '
  };

  for (const [bad, good] of Object.entries(fixes)) {
      content = content.split(bad).join(good);
  }

  // General fixes
  content = content.replace(/ /g, '€');
  content = content.replace(/Sberblick/g, 'Überblick');
  content = content.replace(/0/g, '≥');
  content = content.replace(/ l/g, 'Öl');
  content = content.replace(/Maxnahme/g, 'Maßnahme');
  content = content.replace(/ausschliexlich/g, 'ausschließlich');

  if (content !== original) {
    fs.writeFileSync(path.join(dir, f), content, 'utf8');
    console.log('Fixed ' + f);
  }
});
console.log('Global fix script completed.');
