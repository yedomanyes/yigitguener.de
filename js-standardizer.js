const fs = require('fs');

// 1. Update main.js to handle Dark Mode toggle globally
let mainJs = fs.readFileSync('main.js', 'utf8');
if (!mainJs.includes('initDarkMode')) {
    mainJs += `\n/* ── Global Dark Mode Toggle ───────────────────────── */
function initDarkMode() {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    if (!toggleBtns.length) return;
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const root = document.documentElement;
            if (root.getAttribute('data-theme') === 'dark') {
                root.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                root.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', () => initDarkMode());
`;
    fs.writeFileSync('main.js', mainJs, 'utf8');
}

// 2. Add inline theme script to header.js to prevent flashing
let headerJs = fs.readFileSync('header.js', 'utf8');
if (!headerJs.includes('localStorage.getItem("theme")')) {
    headerJs = headerJs.replace(`document.write(\``, `document.write(\`\n<script>(function(){const t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.setAttribute("data-theme","dark");}})();</script>\n`);
    fs.writeFileSync('header.js', headerJs, 'utf8');
}

console.log("Global scripts updated.");
