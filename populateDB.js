const fs = require('fs');
const natural = require('natural');

let afinn = JSON.parse(fs.readFileSync('afinn.json'));
let companies = JSON.parse(fs.readFileSync('companies.json'));
let blogpost = JSON.parse(fs.readFileSync('blogpost.json'));

// console.log('afinn: ',afinn);
// console.log('companies: ',companies);
// console.log('blogpost: ',blogpost);
let companiesObj = {};

//split by any non-word element
let words = blogpost['text'].split(/\W/);

let scoredWords = [];
let totalScore = 0;
for (let i = 0; i < words.length; i++) {
  if(words[i]){
      let word = words[i];
      // get afinn sentiment of given word
      if (afinn.hasOwnProperty(word.toLowerCase())) {
        var score = afinn[word];
        totalScore += Number(score);
        scoredWords.push(word + ': ' + score + ' ');
      }
      // compare similarity of word to company names
      let companiesObj = {};
      for (let x = 0; x < companies.length; x++) {
        let companyName = companies[x].Name;
        if(companyName && word.charAt(0) == word.charAt(0).toUpperCase()
           ){
          let similarity = natural.DiceCoefficient(companies[x].Name, word);
          if(similarity>0.5){
            console.log(similarity);
            console.log(companies[x].Name);
            console.log(word);
          }  
        }
        
        // companiesObj[companies[i].Name] = companies[i].Symbol;
      }
  }
}

// console.log('totalScore: ', totalScore);
// console.log('scoredWords: ',scoredWords);
// console.log('companiesObj: ',companiesObj);


