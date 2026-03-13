const fs = require('fs');

function standardizePage(file) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Replace <nav ...> ... </nav> block with <script src="header.js"></script>
    // Note: index.html has <nav class="nav"> and <div class="nav__mobile" ...> ... </nav>
    const navMatch = content.match(/<nav class="nav">[\s\S]*?<\/nav>/);
    if (navMatch) {
        content = content.replace(navMatch[0], '<script src="header.js"></script>');
    }

    // 2. Replace <footer ...> ... </footer> block with <script src="footer.js"></script>
    const footMatch = content.match(/<footer[\s\S]*?<\/footer>/);
    if (footMatch) {
        content = content.replace(footMatch[0], '<script src="footer.js"></script>');
    }

    // 3. Remove inline <style> block from foerderungen.html because it conflicts with index.css
    if (file === 'foerderungen.html') {
        const styleMatch = content.match(/<style>[\s\S]*?<\/style>/);
        if (styleMatch) {
            content = content.replace(styleMatch[0], '<link rel="stylesheet" href="index.css">');
        }

        // Remove duplicate body styling/tags if they use different patterns
        // actually just write back.
    }

    // 4. In index.html, remove the "hp-theme-toggle" script logic since it's now in main.js
    if (file === 'index.html') {
        const scriptMatch = content.match(/<script>\s*\/\/ -----------------------------------------------------\s*\/\/\s+Dark Mode Toggle[\s\S]*?<\/script>/);
        if (scriptMatch) {
            content = content.replace(scriptMatch[0], '');
        }
    }

    fs.writeFileSync(file, content, 'utf8');
}

standardizePage('index.html');
standardizePage('foerderungen.html');
console.log('Done standardizing html files');
