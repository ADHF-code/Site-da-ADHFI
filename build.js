const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'dist');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const file of ['sitemap.xml', 'googled7f3aa5fad8b73a8.html']) {
  if (fs.existsSync(file)) fs.copyFileSync(file, path.join(outDir, file));
}

let html = fs.readFileSync('index.html', 'utf8');

// Canonical URL for the public domain.
if (!html.includes('rel="canonical"')) {
  html = html.replace('</head>', '<link rel="canonical" href="https://www.adhfi.site/">\n</head>');
}

// Keep the official Portuguese Online Complaints Book visible.
if (!html.includes('livroreclamacoes.pt')) {
  const anchor = '<a href="#valencias">As valências</a>';
  const complaintsLink = '<a href="https://www.livroreclamacoes.pt/INICIO/" target="_blank" rel="noopener noreferrer">Livro de Reclamações Online ↗</a>';
  html = html.replace(anchor, `${complaintsLink}\n        ${anchor}`);
}

// ADHFI is the ecosystem hub, not another operational microsite.
html = html.replace(
  'Desenvolvimento humano e formação integral de jovens — onde cada valência reforça e potencia as restantes.',
  'Educação, desporto, experiências internacionais, tecnologia e relações. Cinco valências, uma associação, um percurso aberto.'
);

// Valency cards become bridges to their existing public sites.
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

// Small visible CTAs clarify that each card is a doorway.
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
html = html.replace(
  '<div class="chips" style="align-self:center"><span class="chip">CFI</span><span class="chip">IFC</span><span class="chip">MBi</span><span class="chip">Nexu</span></div>\n        </div>\n      </div>',
  '<div class="chips" style="align-self:center"><span class="chip">CFI</span><span class="chip">IFC</span><span class="chip">MBi</span><span class="chip">Nexu</span></div>\n        </div>\n        <div class="card-cta">Conhecer Digital Lab →</div>\n      </div>'
);
html = html.replace(
  '<div class="chips" style="align-self:center"><span class="chip">→ IFC</span><span class="chip">→ Digital Lab</span><span class="chip">→ apoios</span></div>\n        </div>\n      </div>',
  '<div class="chips" style="align-self:center"><span class="chip">→ IFC</span><span class="chip">→ Digital Lab</span><span class="chip">→ apoios</span></div>\n        </div>\n        <div class="card-cta">Conhecer Nexu →</div>\n      </div>'
);

const extraStyles = `
  /* ECOSYSTEM BRIDGE */
  .card-cta{margin-top:18px;font-family:'Space Mono',monospace;font-size:.75rem;font-weight:700;letter-spacing:.03em;color:var(--accent,var(--navy));pointer-events:none}
  .card.wide .card-cta{color:var(--orange)}
  .bridge{padding:0;background:var(--white)}
  .bridge-inner{margin-top:12px;margin-bottom:12px;padding:clamp(34px,5vw,58px);border-radius:24px;background:linear-gradient(125deg,var(--ink),#18245f);color:#fff;display:grid;grid-template-columns:1.15fr .85fr;gap:46px;align-items:center}
  .bridge .eyebrow{color:var(--orange);margin-bottom:14px}
  .bridge h2{font-size:clamp(1.9rem,3.6vw,3rem);color:#fff;max-width:16ch}
  .bridge h2 span{color:var(--orange)}
  .bridge p{color:rgba(255,255,255,.76);font-size:1.05rem;max-width:52ch}
  @media(max-width:800px){.bridge-inner{grid-template-columns:1fr;gap:22px;border-radius:0;margin:0}.bridge h2{max-width:none}}
`;
if (!html.includes('/* ECOSYSTEM BRIDGE */')) {
  html = html.replace('</style>', `${extraStyles}</style>`);
}

const bridge = `
<section class="bridge" id="pertencer">
  <div class="wrap bridge-inner reveal">
    <div>
      <div class="eyebrow">Uma associação. Várias portas.</div>
      <h2>Entraste por uma valência. <span>Pertences ao ecossistema inteiro.</span></h2>
    </div>
    <p>Uma família que chega pelo CFI descobre o IFC, o MB International, o Digital Lab e o Nexu. Quem entra pelo futebol, por uma viagem ou por um projeto digital passa a conhecer as restantes oportunidades da ADHFI.</p>
  </div>
</section>

`;
if (!html.includes('id="pertencer"')) {
  html = html.replace('<section id="emacao">', `${bridge}<section id="emacao">`);
}

fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log('ADHFI ecosystem hub built to dist/');
