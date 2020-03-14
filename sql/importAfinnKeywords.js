let mysql = require('mysql');
let dotenv = require('dotenv').config();
const fs = require('fs');
let dbconfig = require('../config/database');

let handleDisconnect = require('../helpers/handleDisconnect');
let executeSQL = require('../helpers/executeSQL');

let afinnKeywords = JSON.parse(fs.readFileSync('../the_data/afinn.json'));
let connection = mysql.createConnection(dbconfig.connection);

for (var key in afinnKeywords) {
	if (afinnKeywords.hasOwnProperty(key)) {
	   	 console.log(key + " -> " + afinnKeywords[key]);

		let insertKeyword = 
		  `INSERT INTO afinn_keyword (keyword, sentiment_score)
		      VALUES ('${key}', 
		              	'${afinnKeywords[key]}')`;

		executeSQL(insertKeyword);
	}
}

handleDisconnect();