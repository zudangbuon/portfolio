const fs = require('fs');
const distHtml = fs.readFileSync('dist/index.html', 'utf8');
const heroMatch = distHtml.match(/(<!-- ══════════════════════════════════\s+HERO SECTION\s+══════════════════════════════════ -->\s*<section id=\"hero\".*?<\/section>)/s);
if (heroMatch) {
  let heroSection = heroMatch[1];
  // Revert any vite asset paths if any
  heroSection = heroSection.replace(/assets\/[a-zA-Z0-9-]+\.([a-z]+)/g, 'assets/avatar.png'); 
  
  let currentHtml = fs.readFileSync('index.html', 'utf8');
  currentHtml = currentHtml.replace('<main>', '<main>\n\n    ' + heroSection + '\n');
  fs.writeFileSync('index.html', currentHtml);
  console.log('Restored hero section!');
} else {
  console.log('Could not find hero section in dist/index.html');
}
