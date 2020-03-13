const fs = require('fs');
const natural = require('natural');
const recursive = require("recursive-readdir");
let afinn = JSON.parse(fs.readFileSync('../the_data/afinn.json'));
let companies = JSON.parse(fs.readFileSync('../the_data/companies.json'));

let negativeKeywordList = ['Financial', 'President', 'Wealth', 'Management'];

//grab files recursively
recursive("../the_data/blogposts", [".git*", "node_modules/*", ], function (err, files) {
    let promises=[];
    if (err) {
      console.log(err);
    } else {
    for (let i = 0; i < files.length; i++) {
      fs.readFile(files[i], function (err, data) {
        if (err)
          throw err;
        if (data){         
          let scoredWords = [];
          let companiesFound = [];
          let totalScore = 0;
          let {uuid, published, text} = JSON.parse(data);
          let words = text.split(/\W/);
                    
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
           
        }
      });
    }
  }
});

