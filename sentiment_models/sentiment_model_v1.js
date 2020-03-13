const fs = require('fs');
const natural = require('natural');

let afinn = JSON.parse(fs.readFileSync('../the_data/afinn.json'));
let companies = JSON.parse(fs.readFileSync('../the_data/companies.json'));
let blogpost = JSON.parse(fs.readFileSync('../the_data/blogpost.json'));

let negativeKeywordList = ['Financial', 'President', 'Wealth', 'Management'];

//js regex: split by anything that's not a letter or a number
let words = blogpost['text'].split(/\W/);

let scoredWords = [];
let companiesFound = [];
let totalScore = 0;

for (let i = 0; i < words.length; i++) {
  if(words[i]){
      let word = words[i];
      // get afinn sentiment of given word
      let lowerCaseWord = word.toLowerCase();
      if (afinn.hasOwnProperty(lowerCaseWord)) {
        var score = afinn[lowerCaseWord];
        totalScore += Number(score);
        scoredWords.push(lowerCaseWord + ': ' + score + ' ');
      }
      // compare similarity of word to company names
      let companiesObj = {};
      for (let x = 0; x < companies.length; x++) {
        let companyName = companies[x].Name;
        if(companyName && 
            //verify that the Company Name found in the article is Capitalized
            word.charAt(0) == word.charAt(0).toUpperCase() 
            && negativeKeywordList.indexOf(word) == -1){
          let similarity = natural.DiceCoefficient(companies[x].Name, word);
          if(similarity>0.5){
            companiesFound.push(companies[x])
            console.log(similarity);
            console.log(companies[x].Name);
            console.log(word);
          }  
        }
      }
  }
}

console.log('totalScore: ', totalScore);
console.log('companiesFound: ', companiesFound);
// console.log('scoredWords: ',scoredWords);


