const fs = require('fs');

const tagsSnippet = [
  '    <!-- Dark Mode Init (prevents flash) -->',
  '    <script>',
  '      (function() {',
  "        var t = localStorage.getItem('theme');",
  "        if (t === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); }",
  "        else { document.documentElement.removeAttribute('data-theme'); }",
  '      })();',
  '    <\/script>',
  '    <!-- Google tag (gtag.js) -->',
  '    <script async src="https://www.googletagmanager.com/gtag/js?id=G-N4VE8HX6XX"><\/script>',
  '    <script>',
  '      window.dataLayer = window.dataLayer || [];',
  '      function gtag(){dataLayer.push(arguments);}',
  "      gtag('js', new Date());",
  "      gtag('config', 'G-N4VE8HX6XX');",
  '    <\/script>',
  '    <!-- Google AdSense -->',
  '    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2068043467304653"',
  '         crossorigin="anonymous"><\/script>',
  ''
].join('\n');

const OLD_VIEWPORT = 'width=device-width, initial-scale=1.0">';
const NEW_VIEWPORT = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">';

function processFile(f) {
  if (!fs.existsSync(f)) { console.log('MISS: ' + f); return; }
  let c = fs.readFileSync(f, 'utf8');

  // Remove existing tags to avoid duplicates
  c = c.replace(/[ \t]*<!-- Dark Mode Init \(prevents flash\) -->[\s\S]*?<\/script>\n?/g, '');
  c = c.replace(/[ \t]*<!-- Google tag[\s\S]*?<\/script>\n?/g, '');
  c = c.replace(/[ \t]*<!-- Google AdSense[\s\S]*?<\/script>\n?/g, '');

  // Fix viewport
  c = c.split(OLD_VIEWPORT).join(NEW_VIEWPORT);

  // Inject before </head>
  if (c.includes('</head>')) {
    c = c.replace('</head>', tagsSnippet + '</head>');
  }

  fs.writeFileSync(f, c, 'utf8');
  console.log('OK: ' + f);
}

const allHtml = fs.readdirSync('.').filter(f => f.endsWith('.html'));
allHtml.forEach(f => {
  if (f === 'datenschutz.html') {
    // datenschutz already has the tags, just fix viewport
    let c = fs.readFileSync(f, 'utf8');
    const before = c;
    c = c.split(OLD_VIEWPORT).join(NEW_VIEWPORT);
    if (c !== before) { fs.writeFileSync(f, c, 'utf8'); console.log('Viewport fixed: ' + f); }
    else { console.log('SKIP (already ok): ' + f); }
    return;
  }
  processFile(f);
});

console.log('\nAll done!');
