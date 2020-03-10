const fs = require('fs');

let afinn = JSON.parse(fs.readFileSync('afinn.json'));

let companies = JSON.parse(fs.readFileSync('companies.json'));

let blogpost = JSON.parse(fs.readFileSync('blogpost.json'));

console.log('afinn: ',afinn);
console.log('companies: ',companies);
console.log('blogpost: ',blogpost);





