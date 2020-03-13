let mysql = require('mysql');
let dotenv = require('dotenv').config();
const fs = require('fs');
let dbconfig = require('../config/database');
// let handleDisconnect = require('./handleDisconnect');;
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

function handleDisconnect() {
  connection = mysql.createConnection(dbconfig.connection); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();