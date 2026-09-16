const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'dist');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const file of ['sitemap.xml', 'googled7f3aa5fad8b73a8.html']) {
  if (fs.existsSync(file)) fs.copyFileSync(file, path.join(outDir, file));
}

let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('rel="canonical"')) {
  html = html.replace('</head>', '<link rel="canonical" href="https://www.adhfi.site/">\n</head>');
}

if (!html.includes('livroreclamacoes.pt')) {
  const anchor = '<a href="#valencias">As valências</a>';
  const complaintsLink = '<a href="https://www.livroreclamacoes.pt/INICIO/" target="_blank" rel="noopener noreferrer">Livro de Reclamações Online ↗</a>';
  html = html.replace(anchor, `${complaintsLink}\n        ${anchor}`);
}

html = html.replace(
  'Desenvolvimento humano e formação integral de jovens — onde cada valência reforça e potencia as restantes.',
  'Educação, desporto, experiências internacionais, tecnologia e relações. Cinco valências, uma associação, um percurso aberto.'
);

html = html.replace(
  '<a class="card-link" href="https://instagram.com/associacaodhfi" target="_blank" rel="noopener" aria-label="Abrir Instagram da Associação DHFI"></a>',
  '<a class="card-link" href="https://cfi-lab.netlify.app/" target="_blank" rel="noopener" aria-label="Abrir CFI"></a>'
);
html = html.replace(
  '<a class="card-link" href="https://instagram.com/ifc_futsal.academia" target="_blank" rel="noopener" aria-label="Abrir Instagram do IFC"></a>',
  '<a class="card-link" href="https://ifchallenge.netlify.app/" target="_blank" rel="noopener" aria-label="Abrir IFC"></a>'
);
html = html.replace(
  '<a class="card-link" href="https://instagram.com/mb_international_" target="_blank" rel="noopener" aria-label="Abrir Instagram do MBi"></a>',
  '<a class="card-link" href="https://mbinternational.netlify.app/" target="_blank" rel="noopener" aria-label="Abrir MB International"></a>'
);

html = html.replace(
  '<div class="chips"><span class="chip">→ MBi</span><span class="chip">→ Digital Lab</span><span class="chip">→ IFC</span></div>\n      </div>',
  '<div class="chips"><span class="chip">→ MBi</span><span class="chip">→ Digital Lab</span><span class="chip">→ IFC</span></div>\n        <div class="card-cta">Abrir CFI →</div>\n      </div>'
);
html = html.replace(
  '<div class="chips"><span class="chip">→ CFI</span><span class="chip">→ MBi</span><span class="chip">→ Nexu</span></div>\n      </div>',
  '<div class="chips"><span class="chip">→ CFI</span><span class="chip">→ MBi</span><span class="chip">→ Nexu</span></div>\n        <div class="card-cta">Abrir IFC →</div>\n      </div>'
);
html = html.replace(
  '<div class="chips"><span class="chip">→ CFI · Pen Friend</span><span class="chip">→ IFC</span></div>\n      </div>',
  '<div class="chips"><span class="chip">→ CFI · Pen Friend</span><span class="chip">→ IFC</span></div>\n        <div class="card-cta">Abrir MB International →</div>\n      </div>'
);

const mobileValencies = `
<div class="mobile-valencies" aria-label="Valências ADHFI">
  <a href="https://cfi-lab.netlify.app/"><strong>CFI</strong><span>Estudo & autonomia</span><b>↗</b></a>
  <a href="https://ifchallenge.netlify.app/"><strong>IFC</strong><span>Desporto & desenvolvimento</span><b>↗</b></a>
  <a href="https://mbinternational.netlify.app/"><strong>MBi</strong><span>Experiências internacionais</span><b>↗</b></a>
  <a href="#valencias"><strong>Digital Lab</strong><span>Tecnologia & criação</span><b>↓</b></a>
  <a href="#valencias"><strong>Nexu</strong><span>Relações & oportunidades</span><b>↓</b></a>
</div>`;
if (!html.includes('class="mobile-valencies"')) {
  html = html.replace('<div class="constel">', `${mobileValencies}\n<div class="constel">`);
}

const bridge = `
<section class="bridge" id="pertencer">
  <div class="wrap bridge-inner reveal">
    <div>
      <div class="eyebrow">Uma associação. Várias portas.</div>
      <h2>Entra por uma valência. <span>Descobre o ecossistema inteiro.</span></h2>
    </div>
    <p>Uma família pode chegar pelo CFI, pelo IFC, pelo MB International ou por outro projeto. O objetivo é simples: cada porta dá acesso a novas experiências, competências, relações e oportunidades dentro da ADHFI.</p>
  </div>
</section>`;
if (!html.includes('id="pertencer"')) {
  html = html.replace('<section id="emacao">', `${bridge}\n<section id="emacao">`);
}

const footerPartner = `
      <div class="fcol fcol-partner">
        <h4>Parcerias</h4>
        <a class="partner-footer-link" href="https://moinho-do-bolinha.netlify.app/" target="_blank" rel="noopener" aria-label="Abrir site do Moinho do Bolinha">
          <img src="https://raw.githubusercontent.com/ADHF-code/Site-da-ADHFI/main/assets/moinho-bolinha-logo.webp" alt="Moinho do Bolinha">
          <span>Moinho do Bolinha ↗</span>
        </a>
      </div>`;
if (!html.includes('class="fcol fcol-partner"')) {
  html = html.replace(
    '      <div class="fcol">\n        <h4>Associação</h4>',
    `${footerPartner}\n      <div class="fcol">\n        <h4>Associação</h4>`
  );
}

const styles = `
/* ADHFI CONVERSION REFRESH */
.card-cta{margin-top:18px;font-family:'Space Mono',monospace;font-size:.75rem;font-weight:700;letter-spacing:.03em;color:var(--accent,var(--navy));pointer-events:none}
nav,nav.solid{background:rgba(248,247,242,.94);backdrop-filter:blur(14px);box-shadow:0 1px 0 rgba(11,18,48,.08);padding:14px 0}
.navlinks a{color:rgba(11,18,48,.72)}
.navlinks a:hover{color:var(--ink)}
.navtoggle{color:var(--ink)}
.hero{background:#F7F5EF;color:var(--ink);padding-top:132px;padding-bottom:82px;min-height:auto}
.hero-bg{display:none}
.hero h1{color:var(--ink);font-size:clamp(2.8rem,6vw,5rem);max-width:10ch}
.hero h1 .hl{color:var(--navy)}
.hero p.lead{color:rgba(11,18,48,.68);max-width:38ch}
.hero .eyebrow{color:var(--teal)}
.hero .eyebrow::before{background:var(--teal)}
.hero .btn-ghost{border-color:rgba(11,18,48,.2);color:var(--ink);background:#fff}
.hero .btn-ghost:hover{border-color:var(--ink)}
.metastrip div{border-left-color:rgba(27,42,107,.25)}
.metastrip .n{color:var(--ink)}
.metastrip .l{color:rgba(11,18,48,.55)}
.constel{background:linear-gradient(145deg,#0B1230,#18245F);border-radius:30px;padding:22px;box-shadow:0 28px 70px rgba(11,18,48,.2)}
.constel-legend{color:#fff}
#constel .node[role="link"]{cursor:pointer;transition:filter .18s ease,opacity .18s ease}
#constel .node[role="link"]:hover{filter:brightness(1.18)}
.mobile-valencies{display:none}
.bridge{padding:0;background:#fff}
.bridge-inner{margin:12px auto;padding:clamp(34px,5vw,58px);border-radius:24px;background:linear-gradient(125deg,#0B1230,#18245F);color:#fff;display:grid;grid-template-columns:1.1fr .9fr;gap:46px;align-items:center}
.bridge .eyebrow{color:var(--orange);margin-bottom:14px}
.bridge h2{font-size:clamp(1.9rem,3.6vw,3rem);color:#fff;max-width:17ch}
.bridge h2 span{color:var(--orange)}
.bridge p{color:rgba(255,255,255,.76);font-size:1.05rem;max-width:52ch}
.footgrid{grid-template-columns:1.4fr 1fr 1fr 1fr 1fr}
.partner-footer-link{display:flex!important;flex-direction:column;align-items:flex-start;gap:10px;max-width:150px}
.partner-footer-link img{display:block;width:112px;height:72px;object-fit:contain;background:#fff;border-radius:10px;padding:6px}
.partner-footer-link span{margin:0!important;color:rgba(255,255,255,.72)!important;font-size:.86rem!important}
.partner-footer-link:hover span{color:#fff!important}
@media(max-width:900px){
  .hero{padding-top:104px;padding-bottom:54px}
  .herogrid{display:block}
  .hero h1{max-width:none;font-size:clamp(2.45rem,12vw,4rem)}
  .hero-copy{max-width:none}
  .hero p.lead{max-width:none;font-size:1rem}
  .constel{display:none!important}
  .constel-legend,.tip{display:none!important}
  .mobile-valencies{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:28px}
  .mobile-valencies a{position:relative;min-height:112px;padding:18px;border-radius:18px;background:#fff;border:1px solid rgba(27,42,107,.12);display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 8px 24px rgba(27,42,107,.06)}
  .mobile-valencies a:first-child{grid-column:1 / -1;background:var(--ink);color:#fff}
  .mobile-valencies strong{font-family:'Bricolage Grotesque';font-size:1.25rem;line-height:1;color:inherit}
  .mobile-valencies span{font-size:.78rem;color:rgba(18,25,58,.6);padding-right:18px}
  .mobile-valencies a:first-child span{color:rgba(255,255,255,.66)}
  .mobile-valencies b{position:absolute;right:16px;top:16px;font-weight:600}
  .metastrip{display:none}
  .bridge-inner{grid-template-columns:1fr;gap:20px;border-radius:0;margin:0;padding:38px 22px}
  .bridge h2{max-width:none}
  .footgrid{grid-template-columns:1fr 1fr}
}
@media(max-width:520px){
  .herocta{display:grid;grid-template-columns:1fr}
  .herocta .btn{width:100%}
  .mobile-valencies{grid-template-columns:1fr 1fr}
  .mobile-valencies a{min-height:104px;padding:16px}
  .mobile-valencies a:first-child{grid-column:1 / -1}
  .footgrid{grid-template-columns:1fr}
}
`;
if (!html.includes('/* ADHFI CONVERSION REFRESH */')) {
  html = html.replace('</style>', `${styles}\n</style>`);
}

const clickScript = `
<script>
document.addEventListener('DOMContentLoaded', function(){
  const routes = {
    'CFI':'https://cfi-lab.netlify.app/',
    'IFC':'https://ifchallenge.netlify.app/',
    'MBi':'https://mbinternational.netlify.app/',
    'Digital Lab':'#valencias',
    'Nexu':'#valencias'
  };
  document.querySelectorAll('#constel .node').forEach(function(node){
    const name=(node.getAttribute('data-name')||'').trim();
    const route=routes[name];
    if(!route) return;
    node.setAttribute('role','link');
    node.setAttribute('tabindex','0');
    node.setAttribute('aria-label','Abrir '+name);
    const go=function(){
      if(route.charAt(0)==='#') {
        const target=document.querySelector(route);
        if(target) target.scrollIntoView({behavior:'smooth'});
      } else {
        window.location.href=route;
      }
    };
    node.addEventListener('click',function(e){e.stopPropagation();go();});
    node.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
  });
});
</script>`;
html = html.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded',[\s\S]*?const routes = \[[\s\S]*?<\/script>/, '');
if (!html.includes("const routes = {")) {
  html = html.replace('</body>', `${clickScript}\n</body>`);
}

fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log('ADHFI footer partnership built to dist/');
