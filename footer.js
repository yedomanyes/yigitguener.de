// footer.js – FoerdercheckPlus
(function () {
  const html = `
<footer style="background:var(--surface-2);color:var(--text);padding:3.5rem 2rem 2rem;font-family:var(--font);border-top:1px solid var(--border);">
  <div style="max-width:var(--max-w);margin:0 auto">
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:3rem;margin-bottom:2.5rem">
      <div>
        <div style="display:flex;align-items:center;gap:9px;font-weight:800;font-size:1.1rem;color:var(--text);margin-bottom:.875rem;letter-spacing:-.02em">
          FoerdercheckPlus
        </div>
        <p style="font-size:.9rem;line-height:1.6;color:var(--text-2);max-width:280px">Der moderne, digitale Ratgeber für staatliche Förderprogramme in Deutschland. Aktuell, verständlich, unabhängig.</p>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:800;color:var(--blue);letter-spacing:.1em;text-transform:uppercase;margin-bottom:.875rem">Kategorien</div>
        <div style="display:flex;flex-direction:column;gap:.75rem">
          <a href="foerderungen.html?kat=energie" style="font-size:.9rem;font-weight:500;color:var(--text-2);text-decoration:none">Energie &amp; Haus</a>
          <a href="foerderungen.html?kat=business" style="font-size:.9rem;font-weight:500;color:var(--text-2);text-decoration:none">Gründen</a>
          <a href="foerderungen.html?kat=mobil" style="font-size:.9rem;font-weight:500;color:var(--text-2);text-decoration:none">Mobilität</a>
          <a href="foerderungen.html?kat=familie" style="font-size:.9rem;font-weight:500;color:var(--text-2);text-decoration:none">Familie</a>
        </div>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:800;color:var(--blue);letter-spacing:.1em;text-transform:uppercase;margin-bottom:.875rem">Programme</div>
        <div style="display:flex;flex-direction:column;gap:.75rem">
          <a href="waermepumpe-foerderung.html" style="font-size:.9rem;font-weight:500;color:var(--text-2);text-decoration:none">Wärmepumpe</a>
          <a href="gruenderzuschuss.html" style="font-size:.9rem;font-weight:500;color:var(--text-2);text-decoration:none">Gründerzuschuss</a>
          <a href="kfw-foerderung.html" style="font-size:.9rem;font-weight:500;color:var(--text-2);text-decoration:none">KfW Kredite</a>
          <a href="familienfoerderung.html" style="font-size:.9rem;font-weight:500;color:var(--text-2);text-decoration:none">Familienförderung</a>
        </div>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:800;color:var(--blue);letter-spacing:.1em;text-transform:uppercase;margin-bottom:.875rem">Rechtliches</div>
        <div style="display:flex;flex-direction:column;gap:.75rem">
          <a href="impressum.html" style="font-size:.9rem;font-weight:500;color:var(--text-2);text-decoration:none">Impressum</a>
          <a href="datenschutz.html" style="font-size:.9rem;font-weight:500;color:var(--text-2);text-decoration:none">Datenschutz</a>
          <a href="kontakt.html" style="font-size:.9rem;font-weight:500;color:var(--text-2);text-decoration:none">Kontakt</a>
          <a href="anmelden.html" style="font-size:.9rem;font-weight:500;color:var(--text-2);text-decoration:none">Anmelden</a>
        </div>
      </div>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:2rem;border-top:1px solid var(--border);font-size:.85rem;color:var(--text-3);flex-wrap:wrap;gap:1rem">
      <span>© 2026 FoerdercheckPlus. Alle Angaben ohne Gewähr.</span>
      <div style="display:flex;gap:1.5rem">
        <a href="impressum.html" style="color:var(--text-3);text-decoration:none">Impressum</a>
        <a href="datenschutz.html" style="color:var(--text-3);text-decoration:none">Datenschutz</a>
      </div>
    </div>
  </div>
</footer>`;

  document.write(html);
})();


