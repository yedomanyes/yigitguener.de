// seed.js - Seeds the 11 initial programs from search.js into the SQLite database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const PROGRAMS = [
    { title: 'Wärmepumpe Förderung 2026', shortDesc: 'Bis zu 70 % Zuschuss für den Einbau einer Wärmepumpe über das Bundesamt für Wirtschaft (BAFA). Jetzt modernisieren und Heizkosten dauerhaft senken.', category: 'energie', fundingAmount: 'Bis zu 70 %', slug: 'waermepumpe-foerderung', status: 'Veröffentlicht', buttons: JSON.stringify([{ text: 'Zur BAFA Förderung', url: 'https://www.bafa.de' }]) },
    { title: 'Photovoltaik Förderung 2026', shortDesc: 'Einspeisevergütung und KfW-Finanzierung für Solaranlagen. Strom selbst erzeugen und dauerhaft Energiekosten sparen.', category: 'energie', fundingAmount: 'Ab 6,81 ct/kWh', slug: 'photovoltaik-foerderung', status: 'Veröffentlicht', buttons: JSON.stringify([{ text: 'Zur KfW Förderung', url: 'https://www.kfw.de' }]) },
    { title: 'Sanierung Förderung 2026', shortDesc: 'Bundesförderung für effiziente Gebäude (BEG): Zuschüsse und günstige Kredite für energetische Sanierungsmaßnahmen.', category: 'energie', fundingAmount: 'Bis zu 45 % + Kredit', slug: 'sanierung-foerderung', status: 'Veröffentlicht', buttons: JSON.stringify([]) },
    { title: 'Heizung Austausch Förderung 2026', shortDesc: 'Austauschprämie beim Tausch alter Öl- und Gasheizungen. Kombinierbar mit anderen BAFA-Förderprogrammen.', category: 'energie', fundingAmount: 'Bis zu 35 %', slug: 'heizung-austausch-foerderung', status: 'Veröffentlicht', buttons: JSON.stringify([]) },
    { title: 'Gründerzuschuss 2026', shortDesc: 'Finanzielle Unterstützung der Bundesagentur für Arbeit für Gründer aus der Arbeitslosigkeit. Bis zu 15 Monate Förderung.', category: 'business', fundingAmount: 'Bis zu 15 Monate', slug: 'gruenderzuschuss', status: 'Veröffentlicht', buttons: JSON.stringify([]) },
    { title: 'Förderungen für Selbstständige 2026', shortDesc: 'Übersicht aller Förderprogramme für Selbstständige und Freiberufler: Mikrokredite, BAFA-Beratungsförderung, EU-Fonds.', category: 'business', fundingAmount: 'Variiert', slug: 'foerderung-selbststaendige', status: 'Veröffentlicht', buttons: JSON.stringify([]) },
    { title: 'KfW Förderprogramme 2026', shortDesc: 'Alle KfW-Kredite und Zuschüsse auf einen Blick: Wohnen, Energie, Gründen, Digitalisierung und mehr.', category: 'wohnen', fundingAmount: 'Ab 1 % Zins', slug: 'kfw-foerderung', status: 'Veröffentlicht', buttons: JSON.stringify([{ text: 'KfW Programme entdecken', url: 'https://www.kfw.de' }]) },
    { title: 'E-Auto Förderung 2026', shortDesc: 'Aktuelle staatliche Förderungen für Elektrofahrzeuge: Steuervorteile, Unternehmensförderungen und Sonderabschreibungen.', category: 'mobil', fundingAmount: 'Steuervorteile', slug: 'e-auto-foerderung', status: 'Veröffentlicht', buttons: JSON.stringify([]) },
    { title: 'Wallbox Förderung 2026', shortDesc: 'Förderungen für private und gewerbliche Wallboxen: Länderprogramme, KfW 440, Arbeitgeber-Modelle.', category: 'mobil', fundingAmount: 'Bis zu 900 €', slug: 'wallbox-foerderung', status: 'Veröffentlicht', buttons: JSON.stringify([]) },
    { title: 'Studienförderung 2026', shortDesc: 'BAföG, Stipendien, Bildungskredite: Alle Möglichkeiten für Studierende kompakt erklärt.', category: 'familie', fundingAmount: 'Bis zu 1.000 €/Monat', slug: 'studienfoerderung', status: 'Veröffentlicht', buttons: JSON.stringify([]) },
    { title: 'Familienförderungen 2026', shortDesc: 'Kindergeld, Elterngeld, Kinderzuschlag, KfW-Wohneigentum: Alle Leistungen für Familien im Überblick.', category: 'familie', fundingAmount: 'Bis zu 250 €/Kind', slug: 'familienfoerderung', status: 'Veröffentlicht', buttons: JSON.stringify([]) },
];

db.serialize(() => {
    // Ensure table exists
    db.run(`CREATE TABLE IF NOT EXISTS programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE,
        shortDesc TEXT,
        content TEXT,
        category TEXT,
        region TEXT,
        fundingAmount TEXT,
        status TEXT DEFAULT 'Entwurf',
        imageUrl TEXT,
        buttons TEXT DEFAULT '[]',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    let inserted = 0;
    PROGRAMS.forEach(p => {
        db.get('SELECT id FROM programs WHERE slug = ?', [p.slug], (err, row) => {
            if (!row) {
                db.run(
                    'INSERT INTO programs (title, slug, shortDesc, category, fundingAmount, status, buttons) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [p.title, p.slug, p.shortDesc, p.category, p.fundingAmount, p.status, p.buttons],
                    (insertErr) => {
                        if (!insertErr) { inserted++; }
                    }
                );
            }
        });
    });

    setTimeout(() => {
        console.log(`Done. Inserted ${inserted} new programs.`);
        db.close();
    }, 1000);
});
