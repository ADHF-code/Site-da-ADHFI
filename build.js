const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'dist');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const file of ['sitemap.xml', 'googled7f3aa5fad8b73a8.html']) {
  if (fs.existsSync(file)) fs.copyFileSync(file, path.join(outDir, file));
}

let html = fs.readFileSync('index.html', 'utf8');

// Public access to the official Portuguese Online Complaints Book.
if (!html.includes('livroreclamacoes.pt')) {
  const anchor = '<a href="#valencias">As valências</a>';
  const complaintsLink = '<a href="https://www.livroreclamacoes.pt/INICIO/" target="_blank" rel="noopener noreferrer">Livro de Reclamações Online ↗</a>';
  html = html.replace(anchor, `${complaintsLink}\n        ${anchor}`);
}

fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log('DHFI site built successfully.');
