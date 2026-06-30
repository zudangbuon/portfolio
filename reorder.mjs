import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

// 1. Extract Platforms from Works section
const platformsStartComment = '<!-- Self-learning platforms -->';
let platformsSplit = content.split(platformsStartComment);

let beforePlatforms = platformsSplit[0];
let afterPlatforms = platformsSplit[1];

let afterPlatformsSplit = afterPlatforms.split('</section>');
let platformsContent = platformsStartComment + afterPlatformsSplit[0]; 
let worksEnd = '</section>' + afterPlatformsSplit.slice(1).join('</section>');

let standalonePlatforms = `
    <!-- ══════════════════════════════════
         SELF-LEARNING PLATFORMS SECTION
    ══════════════════════════════════ -->
    <section id="platforms" class="section-skills section" aria-label="Practice Platforms">
      <div class="container">
        ` + platformsContent.replace(/<!-- Self-learning platforms -->\s*/, '') + `
      </div>
    </section>
`;

// Update Works section to just be Works
let newWorks = beforePlatforms + `    </div>\n    </section>\n\n`;

content = newWorks + worksEnd;

// Split by section headers
const regex = /(?=<!-- ══════════════════════════════════\n\s+[A-Z &]+ SECTION)/g;
let chunks = content.split(regex);

let heroChunk = chunks[0]; 
let aboutChunk = chunks.find(c => c.includes('ABOUT SECTION'));
let skillsChunk = chunks.find(c => c.includes('SKILLS SECTION'));
let worksChunk = chunks.find(c => c.includes('PROJECTS SECTION'));
let ctfChunk = chunks.find(c => c.includes('CTF COMPETITIONS SECTION'));
let experienceChunk = chunks.find(c => c.includes('EXPERIENCE & EDUCATION SECTION'));
let contactChunk = chunks.find(c => c.includes('CONTACT SECTION'));

let newOrder = [
    heroChunk,
    aboutChunk,
    skillsChunk,
    experienceChunk,
    worksChunk,
    ctfChunk,
    standalonePlatforms,
    contactChunk
].filter(Boolean);

fs.writeFileSync('index.html', newOrder.join(''), 'utf8');
console.log('Reordered successfully!');
