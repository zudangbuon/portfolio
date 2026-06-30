const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldNav = `        <li><a href="#about" class="nav-link" id="nav-about">About</a></li>
        <li><a href="#skills" class="nav-link" id="nav-skills">Skills</a></li>
        <li><a href="#works" class="nav-link" id="nav-works">Projects</a></li>
        <li><a href="#ctf" class="nav-link" id="nav-ctf">CTF</a></li>
        <li><a href="#experience" class="nav-link" id="nav-exp">Experience</a></li>

        <li><a href="#contact" class="nav-link" id="nav-contact">Contact</a></li>`;

const newNav = `        <li><a href="#about" class="nav-link" id="nav-about">About</a></li>
        <li><a href="#skills" class="nav-link" id="nav-skills">Skills</a></li>
        <li><a href="#experience" class="nav-link" id="nav-exp">Education</a></li>
        <li><a href="#works" class="nav-link" id="nav-works">Projects</a></li>
        <li><a href="#ctf" class="nav-link" id="nav-ctf">CTF</a></li>
        <li><a href="#platforms" class="nav-link" id="nav-platforms">Learning</a></li>
        <li><a href="#contact" class="nav-link" id="nav-contact">Contact</a></li>`;

// Replace desktop nav
html = html.replace(oldNav, newNav);

const oldMobileNav = `        <li><a href="#about" class="mobile-link">About</a></li>
        <li><a href="#skills" class="mobile-link">Skills</a></li>
        <li><a href="#works" class="mobile-link">Projects</a></li>
        <li><a href="#ctf" class="mobile-link">CTF</a></li>
        <li><a href="#experience" class="mobile-link">Experience</a></li>

        <li><a href="#contact" class="mobile-link">Contact</a></li>`;

const newMobileNav = `        <li><a href="#about" class="mobile-link">About</a></li>
        <li><a href="#skills" class="mobile-link">Skills</a></li>
        <li><a href="#experience" class="mobile-link">Education</a></li>
        <li><a href="#works" class="mobile-link">Projects</a></li>
        <li><a href="#ctf" class="mobile-link">CTF</a></li>
        <li><a href="#platforms" class="mobile-link">Learning</a></li>
        <li><a href="#contact" class="mobile-link">Contact</a></li>`;

// Replace mobile nav
html = html.replace(oldMobileNav, newMobileNav);

fs.writeFileSync('index.html', html);
console.log('Updated navigation links!');
