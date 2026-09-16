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
  <a href="https://cfi-lab.netlify.app/" target="_blank" rel="noopener"><strong>CFI</strong><span>Estudo & autonomia</span><b>↗</b></a>
  <a href="https://ifchallenge.netlify.app/" target="_blank" rel="noopener"><strong>IFC</strong><span>Desporto & desenvolvimento</span><b>↗</b></a>
  <a href="https://mbinternational.netlify.app/" target="_blank" rel="noopener"><strong>MBi</strong><span>Experiências internacionais</span><b>↗</b></a>
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

const partners = `
<section class="partners" id="parceiros">
  <div class="wrap">
    <div class="partners-head reveal">
      <div class="eyebrow">Parceiros do ecossistema</div>
      <h2>Crescemos com quem partilha o percurso.</h2>
      <p>Parcerias que acrescentam contexto, proximidade e novas oportunidades às famílias e aos jovens.</p>
    </div>
    <a class="partner-card reveal" href="https://obolinha.pt/" target="_blank" rel="noopener" aria-label="Conhecer O Moinho do Bolinha">
      <div class="partner-mark"><img src="https://raw.githubusercontent.com/ADHF-code/Site-da-ADHFI/c383a4c8f06b8f923872312f629e260afd03c966/assets/moinho-bolinha-logo.webp" alt="O Moinho do Bolinha"></div>
      <div class="partner-copy"><span>Parceiro educativo</span><strong>O Moinho do Bolinha</strong><p>Educação, acompanhamento e desenvolvimento em articulação com o ecossistema ADHFI.</p></div>
      <div class="partner-arrow">↗</div>
    </a>
  </div>
</section>`;
if (!html.includes('id="parceiros"')) {
  html = html.replace('<footer>', `${partners}\n<footer>`);
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
.mobile-valencies{display:none}

.bridge{padding:0;background:#fff}
.bridge-inner{margin:12px auto;padding:clamp(34px,5vw,58px);border-radius:24px;background:linear-gradient(125deg,#0B1230,#18245F);color:#fff;display:grid;grid-template-columns:1.1fr .9fr;gap:46px;align-items:center}
.bridge .eyebrow{color:var(--orange);margin-bottom:14px}
.bridge h2{font-size:clamp(1.9rem,3.6vw,3rem);color:#fff;max-width:17ch}
.bridge h2 span{color:var(--orange)}
.bridge p{color:rgba(255,255,255,.76);font-size:1.05rem;max-width:52ch}

.partners{background:#F7F5EF;padding:clamp(64px,8vw,96px) 0}
.partners-head{max-width:700px;margin-bottom:30px}
.partners-head .eyebrow{color:var(--teal);margin-bottom:12px}
.partners-head h2{font-size:clamp(2rem,4vw,3rem);color:var(--navy);margin-bottom:14px}
.partners-head p{color:var(--muted);max-width:56ch}
.partner-card{display:grid;grid-template-columns:180px 1fr 48px;align-items:center;gap:28px;background:#fff;border:1px solid var(--line);border-radius:20px;padding:24px 26px;transition:transform .22s,box-shadow .22s,border-color .22s}
.partner-card:hover{transform:translateY(-4px);box-shadow:0 20px 50px rgba(27,42,107,.12);border-color:transparent}
.partner-mark{height:118px;border-radius:16px;background:#fff;display:grid;place-items:center;overflow:hidden;padding:8px}
.partner-mark img{width:100%;height:100%;object-fit:contain;display:block}
.partner-copy span{font-family:'Space Mono',monospace;font-size:.68rem;text-transform:uppercase;letter-spacing:.14em;color:var(--teal);font-weight:700}
.partner-copy strong{display:block;font-family:'Bricolage Grotesque';font-size:1.4rem;color:var(--navy);margin:4px 0 6px}
.partner-copy p{color:var(--muted);font-size:.95rem}
.partner-arrow{width:44px;height:44px;border-radius:50%;background:var(--mist);display:grid;place-items:center;font-size:1.1rem;color:var(--navy)}

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
  .partner-card{grid-template-columns:1fr 42px;gap:18px;padding:18px}
  .partner-mark{grid-column:1 / -1;height:140px}
}
@media(max-width:520px){
  .herocta{display:grid;grid-template-columns:1fr}
  .herocta .btn{width:100%}
  .mobile-valencies{grid-template-columns:1fr 1fr}
  .mobile-valencies a{min-height:104px;padding:16px}
  .mobile-valencies a:first-child{grid-column:1 / -1}
}
`;
if (!html.includes('/* ADHFI CONVERSION REFRESH */')) {
  html = html.replace('</style>', `${styles}\n</style>`);
}

const clickScript = `
<script>
document.addEventListener('DOMContentLoaded', function(){
  const routes = [
    {match:/\bCFI\b/i,url:'https://cfi-lab.netlify.app/'},
    {match:/\bIFC\b/i,url:'https://ifchallenge.netlify.app/'},
    {match:/\bMBI\b|MB INTERNATIONAL/i,url:'https://mbinternational.netlify.app/'},
    {match:/DIGITAL|LAB/i,url:'#valencias'},
    {match:/NEXU/i,url:'#valencias'}
  ];
  document.querySelectorAll('.constel .node').forEach(function(node){
    const text=(node.textContent||'').replace(/\s+/g,' ').trim();
    const route=routes.find(function(r){return r.match.test(text)});
    if(!route) return;
    node.setAttribute('role','link');
    node.setAttribute('tabindex','0');
    node.style.cursor='pointer';
    const go=function(){
      if(route.url.charAt(0)==='#') document.querySelector(route.url)?.scrollIntoView({behavior:'smooth'});
      else window.open(route.url,'_blank','noopener');
    };
    node.addEventListener('click',go);
    node.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
  });
});
</script>`;
if (!html.includes('const routes = [')) {
  html = html.replace('</body>', `${clickScript}\n</body>`);
}

fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log('ADHFI conversion refresh built to dist/');
