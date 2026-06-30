const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let lines = html.split('\n');
let openSections = 0;
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.match(/<section/)) {
        openSections++;
    }
    if (line.match(/<\/section>/)) {
        openSections--;
    }
}
console.log('Open sections at end:', openSections);

let divMatch = html.match(/<div/g) || [];
let divCloseMatch = html.match(/<\/div>/g) || [];
console.log('Divs open:', divMatch.length, 'Divs close:', divCloseMatch.length);
