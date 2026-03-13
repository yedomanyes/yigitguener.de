// clean-encoding.js — Repairs all garbled character sequences in HTML files
// Run with: node clean-encoding.js

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname);
const skip = ['admin.html', 'anmelden.html', 'kontakt.html', 'impressum.html', 'datenschutz.html', 'foerderungen.html', 'index.html'];
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !skip.includes(f));

// List of known garbled sequences found in these files → replacement
// The replacement char U+FFFD (displayed as ?) followed by control chars is the main pattern
const replacements = [
    // BOM at start of file
    [/^\uFFFD/, ''],
    [/^\ufeff/, ''],

    // --- Badge & Meta icon garbled sequences ---
    // ⚡ Energie & Haus badge garbled variations
    [/\uFFFD[a-z]?\uFFFD\s*Energie\s*&amp;\s*Haus/g, 'Energie &amp; Haus'],
    [/\uFFFD[a-z]?\uFFFD\s*Energie\s*&\s*Haus/g, 'Energie & Haus'],
    [/[\uFFFD\u0019\u001a\u001b\u001c\u001d\u001e\u001f]+/g, ''],

    // --- Meta items: "Aktuell für 2026" / "BAFA" icon garbled ---
    [/[^\x20-\x7E\u00C0-\u024F\u0300-\u036F\uFFFE\s]+(?=(Aktuell|BAFA|Energie|Haus|Gründen|Mobil|Familie|Wohnen|KfW))/g, ''],

    // --- em dash / dash sequences (U+2014 garbled) ---
    [/\uFFFD\u001c/g, '–'],
    [/\uFFFD\u001a/g, '€'],
    [/\uFFFD\u001e/g, 'ℹ'],
    [/\uFFFD\u0013/g, 'Ö'],

    // --- Greater-than / comparison operators garbled ---
    [/\uFFFD0\uFFFD/g, '≥'],

    // --- Info-box icons garbled ---
    [/\uFFFD[^\x20-\x7E\u00C0-\u024F\s]+/g, ''],

    // --- Any remaining U+FFFD replacement characters ---
    [/\uFFFD+/g, ''],

    // Fix leftover artifacts: lone control chars
    [/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''],

    // Clean up empty spans that had only broken icons
    [/<span class="info-box__icon">\s*<\/span>/g, ''],
    [/<span class="detail-hero__meta-item">\s*(?:&amp;|&)?\s*Aktuell/g, '<span class="detail-hero__meta-item">📅 Aktuell'],
    [/<span class="detail-hero__meta-item">\s*(?:️|️|:)?\s*BAFA/g, '<span class="detail-hero__meta-item">🏛 BAFA'],

    // Remove leftover ampersand artifacts before known words
    [/&(?:amp;)?\s*(Aktuell|BAFA|Energie|Haus)/g, (m, w) => w],
];

let totalFixed = 0;

files.forEach(file => {
    const fp = path.join(dir, file);
    let content;
    try {
        content = fs.readFileSync(fp, 'utf8');
    } catch(e) {
        console.log('Skip (read error):', file);
        return;
    }

    let fixed = content;
    let changed = false;

    replacements.forEach(([pattern, replacement]) => {
        const before = fixed;
        fixed = fixed.replace(pattern, replacement);
        if (fixed !== before) changed = true;
    });

    // Also strip BOM bytes from the very beginning (as raw bytes)
    if (fixed.charCodeAt(0) === 0xFFFD || fixed.charCodeAt(0) === 0xFEFF) {
        fixed = fixed.slice(1);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(fp, fixed, 'utf8');
        totalFixed++;
        console.log('Fixed:', file);
    } else {
        console.log('OK (no changes):', file);
    }
});

console.log(`\nDone. Fixed ${totalFixed} files.`);
