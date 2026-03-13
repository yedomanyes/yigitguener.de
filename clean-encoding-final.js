// clean-encoding-final.js — Final targeted fixes for remaining broken sequences
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname);
const skip = ['admin.html', 'anmelden.html', 'kontakt.html', 'impressum.html', 'datenschutz.html', 'foerderungen.html', 'index.html'];
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !skip.includes(f));

// Key: precise broken text → correct replacement text
// Each entry is [search-string, replacement-string]
const exactFixes = [
    // Badge: "Energie Haus" -> "⚡ Energie & Haus"
    ['Energie Haus', '⚡ Energie &amp; Haus'],
    // Badge for other categories (if stripped)
    ['Gründen Business', '💼 Gründen &amp; Business'],
    ['Familie Bildung', '👨‍👩‍👧 Familie &amp; Bildung'],
    ['Mobilität', '🚗 Mobilität'],
    ['Wohnen Kredit', '🏡 Wohnen &amp; Kredit'],

    // Meta items with leftover "x" prefix  
    ['>xAktuell', '>📅 Aktuell'],
    ['>x:️ BAFA', '>🏛 BAFA'],
    ['>x BAF', '>🏛 BAF'],
    ['>xBAFA', '>🏛 BAFA'],  
    ['>x KfW', '>🏦 KfW'],
    ['>x:', '>'],

    // Info-box icons with leftover "x"
    ['>x<', '><'],

    // Öl (oil) - the "Ö" was garbled to nothing, now we have just "l"
    ['Heizung (l, Gas', 'Heizung (Öl, Gas'],
    ['funktionierende l-', 'funktionierende Öl-'],
    ['Öl- oder\r\n                            Gasheizung', 'Öl- oder Gasheizung'],
    ['Öl-, Gas', 'Öl-, Gas'],

    // Money amounts - "€" was garbled to nothing
    ['40.000 /Jahr', '40.000 €/Jahr'],
    ['30.000  für', '30.000 € für'],
    ['20.000 .', '20.000 €.'],
    ['10.000  Zuschuss', '10.000 € Zuschuss'],
    ['10.000 .', '10.000 €.'],
    ['15.000  für', '15.000 € für'],
    ['60.000  für', '60.000 € für'],
    ['Max. Investition</td><td>', 'Max. Investition</td><td>'],

    // Quick overview table garbled amounts  
    ['30€/70 %', '30–70 %'],
    ['30/70', '30–70'],

    // "Maxnahme" -> "Maßnahme"
    ['Maxnahme', 'Maßnahme'],
    ['Manahme', 'Maßnahme'],

    // En-dash artifacts - "–" already placed correctly, clean whitespace
    ['  wenn', ' – wenn'],
    ['  bei besonders', ' – bei besonders'],
    ['  für Haushalte', ' – für Haushalte'],

    // Title artifacts: "2026  Bis" → "2026 – Bis"
    ['Förderung 2026  Bis', 'Förderung 2026 – Bis'],

    // Clean up remaining ":️" artifacts (variation selector)
    [':️ BAFA', ' BAFA'],

    // Fix "Jahresarbeitszahl (JAZ) 0 2,5" → "≥ 2,5"
    ['(JAZ) 0 2,5', '(JAZ) ≥ 2,5'],
    ['(JAZ) 0 2,0', '(JAZ) ≥ 2,0'],

    // Info-box icon: lone "️" variation selector
    ['>️<', '><'],
];

let totalFixed = 0;

files.forEach(file => {
    const fp = path.join(dir, file);
    let content;
    try {
        content = fs.readFileSync(fp, 'utf8');
    } catch(e) {
        console.log('Skip (error):', file);
        return;
    }

    let fixed = content;
    let changed = false;

    exactFixes.forEach(([search, replacement]) => {
        if (fixed.includes(search)) {
            fixed = fixed.split(search).join(replacement);
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(fp, fixed, 'utf8');
        totalFixed++;
        console.log('Fixed:', file);
    } else {
        console.log('OK:', file);
    }
});

console.log(`\nDone. Fixed ${totalFixed} files.`);
