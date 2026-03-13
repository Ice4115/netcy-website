const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('CV - Jung Jean-Marie.pdf');

let parseCommand = typeof pdf === 'function' ? pdf : pdf.default;
parseCommand(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(err => console.error(err));
