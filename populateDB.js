const fs = require('fs');

let afinn = JSON.parse(fs.readFileSync('afinn.json'));

let companies = JSON.parse(fs.readFileSync('companies.json'));

let blogpost = JSON.parse(fs.readFileSync('blogpost.json'));

// console.log('afinn: ',afinn);
// console.log('companies: ',companies);
// console.log('blogpost: ',blogpost);


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
}

console.log('totalScore: ', totalScore);
console.log('scoredWords: ',scoredWords);


// var scorePar = select('#scoreP');
// scorePar.html('score: ' + totalScore);
// var comp = select('#comparativeP');
// comp.html('comparative: ' + totalScore / words.length);
// var wordlist = select('#wordlistP');
// wordlist.html(scoredwords);



