const fs = require('fs');

let afinn = JSON.parse(fs.readFileSync('afinn.json'));
let companies = JSON.parse(fs.readFileSync('companies.json'));
let blogpost = JSON.parse(fs.readFileSync('blogpost.json'));

// console.log('afinn: ',afinn);
// console.log('companies: ',companies);
// console.log('blogpost: ',blogpost);
let companiesObj = {};
for (var i = 0; i < companies.length; i++) {
  companiesObj[companies[i].Name] = companies[i].Symbol;
}

//split by any non-word element
var words = blogpost['text'].split(/\W/);
// console.log(words);

var scoredWords = [];
var totalScore = 0;
for (var i = 0; i < words.length; i++) {
  var word = words[i].toLowerCase();
  if (afinn.hasOwnProperty(word)) {
    var score = afinn[word];
    totalScore += Number(score);
    scoredWords.push(word + ': ' + score + ' ');
  }
  // if(){

  // }
}

// console.log('totalScore: ', totalScore);
// console.log('scoredWords: ',scoredWords);
console.log('companiesObj: ',companiesObj);


