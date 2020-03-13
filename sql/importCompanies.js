let mysql = require('mysql');
let dotenv = require('dotenv').config();
const fs = require('fs');
let dbconfig = require('../config/database');
let handleDisconnect = require('./handleDisconnect');;
let companies = JSON.parse(fs.readFileSync('../the_data/companies.json'));
let connection = mysql.createConnection(dbconfig.connection);

for (let i = 0; i < companies.length; i++) {
	let insertCompany = 
	  `INSERT INTO company (company_name, company_sector, company_symbol)
	      VALUES ('${companies[i].Name}', 
	              	'${companies[i].Sector}', 
	              	'${companies[i].Symbol}')`;

	console.log('insertCompany: ',insertCompany);

	connection.query(insertCompany, function (err, result, fields) {
		if (err){
			handleDisconnect();
			console.log('err: ',err);
		}
			if(!result){
				console.log('no result');
			} else {
				console.log('result: ',result);
			}
	}); 

}

handleDisconnect();