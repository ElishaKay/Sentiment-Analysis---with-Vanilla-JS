var dotenv = require('dotenv').config();
const fs = require('fs');
const natural = require('natural');
const recursive = require("recursive-readdir");
const mysql = require('mysql');
let dbconfig = require('../config/database');
let connection = mysql.createConnection(dbconfig.connection);
let handleDisconnect = require('../helpers/handleDisconnect');
let executeSQL = require('../helpers/executeSQL');

let afinn = JSON.parse(fs.readFileSync('../the_data/afinn.json'));
let companies = JSON.parse(fs.readFileSync('../the_data/companies.json'));

let negativeKeywordList = ['Financial', 'President', 'Wealth', 'Management'];

//grab files recursively
recursive("../../batch_1/c", [".git*", "node_modules/*", ], function (err, files) {
    let promises=[];
    if (err) {
      console.log(err);
    } else {
    for (let i = 0; i < files.length; i++) {
      setTimeout(function(){ 
        analyzeArticle(files[i]);
      }, 
      3000);

      
    }
  }
});

let analyzeArticle = (file) => {
  fs.readFile(file, function (err, data) {
        if (err)
          throw err;
        if (data){         
          let scoredWords = [];
          let companiesFound = [];
          let totalScore = 0;
          let {uuid, published, title, text} = JSON.parse(data);
          let words = text.split(/\W/);
          
          //search for sentimental_words + company_names       
          for (let i = 0; i < words.length; i++) {
            if(words[i]){
                let word = words[i];
                // get afinn sentiment of given word
                let lowerCaseWord = word.toLowerCase();
                if (afinn.hasOwnProperty(lowerCaseWord)) {
                  var score = afinn[lowerCaseWord];
                  totalScore += Number(score);
                  scoredWords.push(lowerCaseWord);
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
                    }  
                  }
                }
            }
          }

          insertArticle(uuid, title, published);

          if(scoredWords.length != 0){
              insertArticleKeywords(scoredWords, uuid);             
          }

          if(companiesFound.length != 0){
              insertCompanyMentions(companiesFound, uuid); 
          }

          wait(300);
          
              
        }
      });
}

let insertArticle = (uuid, title, published) => {

  let insertArticleQuery = 
    `INSERT INTO article (article_uuid, article_title, article_published_date, created_at, updated_at)
        VALUES ('${uuid}', 
                  '${formatQuotes(title)}', 
                  '${published}',
                    NOW(),
                    NOW())`;

  executeSQL(insertArticleQuery);
}


let insertCompanyMentions = (companiesFound, uuid) => {

  let insertCompanyMentionsQuery = 
    `INSERT INTO company_mention (company_symbol, article_uuid, created_at, updated_at)
        VALUES`;

  for (let z = 0; z < companiesFound.length; z++) {
         insertCompanyMentionsQuery+= `${z===0 ? '' : ','}('${companiesFound[z].Symbol}',
                  '${uuid}',
                    NOW(),
                    NOW())`
  }

  executeSQL(insertCompanyMentionsQuery);
}

let insertArticleKeywords = (scoredWords, uuid) => { 
  let insertArticleKeywordsQuery =     
    `INSERT INTO article_keyword (article_uuid, keyword, created_at, updated_at)
        VALUES`

  for (let y = 0; y < scoredWords.length; y++) {       
      insertArticleKeywordsQuery += `${y===0 ? '' : ','} ('${uuid}', 
          '${scoredWords[y]}',
            NOW(),
            NOW())`;              
  }

  executeSQL(insertArticleKeywordsQuery);
}

let wait = (ms) => {
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
    end = new Date().getTime();
    }
}

let formatQuotes = (str)=>{
  var reg = /"/g;
  var newstr = '\\"';
  str = str.replace(reg,newstr);

  var reg2 = /'/g;
  return  str.replace(reg2,newstr);
}

handleDisconnect();