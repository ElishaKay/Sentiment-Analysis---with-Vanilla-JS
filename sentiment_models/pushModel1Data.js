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
recursive("../../batch_1/a", [".git*", "node_modules/*", ], function (err, files) {
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
          let {uuid, published, title, text} = JSON.parse(data);
          let words = text.split(/\W/);
                    
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

          insertArticle(uuid, title, published);

          for (let y = 0; y < scoredWords.length; y++) {
              console.log('scoredWords',scoredWords);       
              insertArticleKeyword(scoredWords[y], uuid);                 
          }

          for (let z = 0; z < companiesFound.length; z++) {
              insertCompanyMention(companiesFound[z].Symbol, uuid);                  
          }

          wait(300);
              
        }
      });
    }
  }
});

let insertArticle = (uuid, title, published) => {

  let insertArticleQuery = 
    `INSERT INTO article (article_uuid, article_title, article_published_date, created_at, updated_at)
        VALUES ('${uuid}', 
                  '${title}', 
                  '${published}',
                    NOW(),
                    NOW())`;

  executeSQL(insertArticleQuery);
}

let insertCompanyMention = (companySymbol, uuid) => { 
  let insertCompanyMentionQuery = 
    `INSERT INTO company_mention (company_id, article_uuid, created_at, updated_at)
        VALUES ((SELECT company_id FROM company WHERE company_symbol LIKE '%${companySymbol}%'),
                  '${uuid}',
                    NOW(),
                    NOW())`;

  executeSQL(insertCompanyMentionQuery);
}

let insertArticleKeyword = (keyword, uuid) => { 
  let insertArticleKeywordQuery =     
    `INSERT INTO article_keyword (article_uuid, keyword, created_at, updated_at)
        VALUES ('${uuid}', 
                  '${keyword}',
                    NOW(),
                    NOW())`;

  executeSQL(insertArticleKeywordQuery);
}

let wait = (ms) => {
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
    end = new Date().getTime();
    }
}

handleDisconnect();