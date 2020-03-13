const request = require("request");
const fs = require('fs');
const mysql = require('mysql');
let dbconfig = require('./config/database');
let connection = mysql.createConnection(dbconfig.connection);
let companies = JSON.parse(fs.readFileSync('../the_data/companies.json'));

let searchForCompanyQuery = `SELECT 
     company_id
     FROM
     company
     WHERE 
     company_name like "%${data.Name}%"`;

console.log('searchForCompanyQuery: ',searchForCompanyQuery);

connection.query(searchForCompanyQuery, function (err, result, fields) {
	if (err){
		handleDisconnect();
		console.log('err: ',err);
	}
		if(!result[0]){
			console.log('no result');
		} else {
			

		}
}); 

handleDisconnect();