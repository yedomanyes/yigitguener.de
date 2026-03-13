// header.js – FoerdercheckPlus (shared navbar for all detail pages)
(function () {
  document.write(`
<script>
  (function() {
    function applyTheme() {
      const t = localStorage.getItem("theme");
      if (t === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    }
    applyTheme();
    // Re-apply on storage change (tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme') applyTheme();
    });
  })();
</script>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Poppins',system-ui,sans-serif}
  a,button{-webkit-tap-highlight-color:transparent;outline:none}
  a:focus-visible,button:focus-visible{outline:2px solid #3B82F6;outline-offset:2px}

  .site-nav{
    position:sticky;top:0;z-index:200;height:72px;
    background:rgba(255,255,255,.9);backdrop-filter:blur(16px);
    -webkit-backdrop-filter:blur(16px);
    border-bottom:1px solid #E2E8F0;display:flex;align-items:center;
    transition: background 0.3s, border-color 0.3s;
  }
  [data-theme="dark"] .site-nav {
    background: rgba(11, 17, 32, 0.9);
    border-bottom: 1px solid #1E293B;
  }

  .site-nav__wrap{
    max-width:1240px;margin:0 auto;padding:0 1.5rem;
    width:100%;display:flex;align-items:center;justify-content:space-between;
  }

  .site-nav__left {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .site-nav__logo{
    font-size:1.1rem;font-weight:900;color:#0F172A;
    letter-spacing:-.03em;text-decoration:none;
    transition: color 0.3s;
  }
  [data-theme="dark"] .site-nav__logo { color: #F8FAFC; }

  .site-nav__links{display:flex;align-items:center;gap:4px;}
  .site-nav__link{
    padding:8px 14px;border-radius:10px;
    font-size:.875rem;font-weight:600;color:#475569;
    text-decoration:none;transition: all 0.2s;
  }
  .site-nav__link:hover{background:rgba(15, 23, 42, 0.05);color:#0F172A}
  [data-theme="dark"] .site-nav__link { color: #94A3B8; }
  [data-theme="dark"] .site-nav__link:hover { background: rgba(255, 255, 255, 0.08); color: #F8FAFC; }
  
  .site-nav__link.active{color:#3B82F6;background:rgba(59, 130, 246, 0.08)}
  [data-theme="dark"] .site-nav__link.active { color: #60A5FA; background: rgba(59, 130, 246, 0.15); }

  .site-nav__right{display:flex;align-items:center;gap:12px;}
  
  .site-nav__cta{
    display:inline-flex;align-items:center;gap:8px;
    background:#3B82F6;color:#FFFFFF;
    padding:10px 22px;border-radius:12px;
    font-size:.875rem;font-weight:700;text-decoration:none;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .site-nav__cta:hover{background:#2563EB;transform:translateY(-1px);box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);}
  
  .theme-toggle {
    background: rgba(15, 23, 42, 0.05); border: none; cursor: pointer; 
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: #475569; transition: all 0.2s;
  }
  [data-theme="dark"] .theme-toggle { background: rgba(255, 255, 255, 0.08); color: #94A3B8; }
  .theme-toggle:hover { background: rgba(15, 23, 42, 0.1); color: #0F172A; }
  [data-theme="dark"] .theme-toggle:hover { background: rgba(255, 255, 255, 0.12); color: #F8FAFC; }

  .theme-toggle svg { width: 20px; height: 20px; stroke-width: 2.2; }
  .theme-toggle .moon-icon { display: none; }
  [data-theme="dark"] .theme-toggle .moon-icon { display: block; }
  [data-theme="dark"] .theme-toggle .sun-icon { display: none; }

  .site-nav__burger{
    display:none;background:none;border:none;cursor:pointer;
    width:40px;height:40px;align-items:center;justify-content:center;
    flex-direction:column;gap:5px;
  }
  .site-nav__burger span{
    display:block;width:22px;height:2px;background:#0F172A;
    border-radius:2px;transition:0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  [data-theme="dark"] .site-nav__burger span { background: #F8FAFC; }
  
  .site-nav__burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .site-nav__burger.open span:nth-child(2) { opacity: 0; transform: translateX(10px); }
  .site-nav__burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* Modern Mobile Menu Overlay */
  .mobile-menu {
    position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    z-index: 190; opacity: 0; pointer-events: none;
    transition: opacity 0.4s ease;
  }
  .mobile-menu.open { opacity: 1; pointer-events: auto; }

  .mobile-menu__content {
    position: absolute; top: 0; right: 0; width: 85%; max-width: 320px; height: 100%;
    background: #FFFFFF; padding: 100px 1.5rem 3rem;
    transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex; flex-direction: column; gap: 8px;
    box-shadow: -20px 0 60px rgba(0,0,0,0.1);
  }
  [data-theme="dark"] .mobile-menu__content { background: #0F172A; }
  .mobile-menu.open .mobile-menu__content { transform: translateX(0); }

  .mobile-menu__link {
    font-size: 1.1rem; font-weight: 700; color: #1E293B;
    text-decoration: none; padding: 14px 20px; border-radius: 16px;
    transition: all 0.3s; opacity: 0; transform: translateX(20px);
  }
  [data-theme="dark"] .mobile-menu__link { color: #F1F5F9; }
  
  .mobile-menu.open .mobile-menu__link { 
    opacity: 1; transform: translateX(0); 
  }
  
  /* Staggered Link Animations */
  .mobile-menu.open .mobile-menu__link:nth-child(1) { transition-delay: 0.1s; }
  .mobile-menu.open .mobile-menu__link:nth-child(2) { transition-delay: 0.15s; }
  .mobile-menu.open .mobile-menu__link:nth-child(3) { transition-delay: 0.2s; }
  .mobile-menu.open .mobile-menu__link:nth-child(4) { transition-delay: 0.25s; }
  .mobile-menu.open .mobile-menu__link:nth-child(5) { transition-delay: 0.3s; }
  .mobile-menu.open .mobile-menu__link:nth-child(6) { transition-delay: 0.35s; }
  .mobile-menu.open .mobile-menu__link:nth-child(7) { transition-delay: 0.4s; }

  .mobile-menu__link:hover, .mobile-menu__link.active { 
    background: rgba(59, 130, 246, 0.08); color: #3B82F6; 
  }
  [data-theme="dark"] .mobile-menu__link:hover, [data-theme="dark"] .mobile-menu__link.active { 
    background: rgba(59, 130, 246, 0.15); color: #60A5FA; 
  }

  /* Accessibility & Readability Fixes */
  .info-box--tip {
    background: #EFF6FF !important;
    color: #1E3A8A !important;
    border-left: 4px solid #3B82F6 !important;
  }
  [data-theme="dark"] .info-box--tip {
    background: rgba(59, 130, 246, 0.2) !important;
    color: #F8FAFC !important;
    border-left: 4px solid #60A5FA !important;
  }

  @media(max-width:980px) {
    .site-nav__links { display: none; }
    .site-nav__burger { display: flex; }
    .site-nav__cta { display: none; }
    .site-nav__wrap { padding: 0 1.25rem; }
  }

  @media(max-width:480px) {
    .site-nav__logo { font-size: 1rem; }
  }
</style>

<nav class="site-nav">
  <div class="site-nav__wrap">
    <div class="site-nav__left">
        <a href="/" class="site-nav__logo">FoerdercheckPlus</a>
        <div class="site-nav__links">
            <a href="/" class="site-nav__link" data-page="index.html">Startseite</a>
            <a href="foerderungen.html" class="site-nav__link" data-page="foerderungen.html">Programme</a>
            <a href="foerderungen.html?kat=energie" class="site-nav__link">Energie</a>
            <a href="foerderungen.html?kat=business" class="site-nav__link">Gründen</a>
            <a href="foerderungen.html?kat=familie" class="site-nav__link">Familie</a>
            <a href="guides.html" class="site-nav__link" data-page="guides.html">Guides</a>
        </div>
    </div>
    
    <div class="site-nav__right">
      <button class="theme-toggle" id="theme-toggle-nav" aria-label="Theme Toggle">
        <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      </button>
      <a href="foerderungen.html" class="site-nav__cta">
        Förderung finden
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
      </a>
      <button class="site-nav__burger" id="sn-burger-nav" aria-label="Menü">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>

<div class="mobile-menu" id="mobile-menu-overlay">
  <div class="mobile-menu__content">
    <a href="/" class="mobile-menu__link" data-page="index.html">Startseite</a>
    <a href="foerderungen.html" class="mobile-menu__link" data-page="foerderungen.html">Alle Programme</a>
    <a href="foerderungen.html?kat=energie" class="mobile-menu__link">Energie & Haus</a>
    <a href="foerderungen.html?kat=business" class="mobile-menu__link">Gründung</a>
    <a href="foerderungen.html?kat=mobil" class="mobile-menu__link">Mobilität</a>
    <a href="foerderungen.html?kat=familie" class="mobile-menu__link">Familienhilfe</a>
    <a href="guides.html" class="mobile-menu__link" data-page="guides.html">Guides</a>
    <div style="margin-top: auto; padding: 20px 0;">
        <a href="foerderungen.html" class="site-nav__cta" style="display: flex; justify-content: center; width: 100%;">Förderung finden</a>
    </div>
  </div>
</div>
`);

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const body = document.body;
    
    // Active link logic
    const path = location.pathname.split('/').pop() || 'index.html';
    const params = new URLSearchParams(window.location.search);
    const kat = params.get('kat');

    const updateActiveLinks = (links) => {
        links.forEach(a => {
            const href = a.getAttribute('href');
            if (kat && href === `foerderungen.html?kat=${kat}`) {
                a.classList.add('active');
            } else if (!kat && a.dataset.page === path) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });
    };

    updateActiveLinks(document.querySelectorAll('.site-nav__link'));
    updateActiveLinks(document.querySelectorAll('.mobile-menu__link'));

    // Burger & Mobile Menu Toggle
    const burger = document.getElementById('sn-burger-nav');
    const overlay = document.getElementById('mobile-menu-overlay');
    
    const toggleMenu = () => {
        const isOpen = burger.classList.toggle('open');
        overlay.classList.toggle('open');
        body.style.overflow = isOpen ? 'hidden' : '';
    };

    burger?.addEventListener('click', toggleMenu);
    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) toggleMenu();
    });

    // Theme Toggle Functionality
    const themeBtn = document.getElementById('theme-toggle-nav');
    themeBtn?.addEventListener('click', () => {
        const isDark = root.getAttribute('data-theme') === 'dark';
        if (isDark) {
            root.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Close menu on resize if screen gets bigger
    window.addEventListener('resize', () => {
        if (window.innerWidth > 980 && burger.classList.contains('open')) {
            toggleMenu();
        }
    });
  });
})();


