const request = require("request");
const fs = require('fs');
let mysql = require('mysql');
let dbconfig = require('./config/database');
let connection = mysql.createConnection(dbconfig.connection);

fs.createReadStream('./csv/Rosh Hashana 2018 - Non-Paypal.csv', { headers: true })
	.pipe(csv.parse({ headers: true }))
	.on("data", function(data){

	if(data.Name!=''){
		//passed preliminary checks
		// console.log('data: ',data)
		let searchForCustomerQuery = `SELECT 
		    id, name 
		     email FROM
		     wpwd_give_customers
		     WHERE 
		     name like "%${data.Name}%"
		     OR email like "%${data.Email}%"`;

		// let theInsertQuery = INSERT INTO table_name (column1, column2, column3, ...)
		// 	VALUES (value1, value2, value3, ...);

		console.log('searchForCustomerQuery: ',searchForCustomerQuery);

		connection.query(searchForCustomerQuery, function (err, result, fields) {
			if (err){
				handleDisconnect();
				console.log('err: ',err);
			}
				if(!result[0]){
					console.log('no result');
				} else {
					console.log('result: ',result);
					console.log('result id',result[0].id);

					if(data.Email_Sent == 'SENT'){
						data.Email_Sent = true;
					} else{
						data.Email_Sent = false;
					}
					let theInsertDonationQuery = `INSERT INTO non_paypal_donations (customer_id, payment_method, donation_amount, email_sent, donation_date)
								 	VALUES ("${result[0].id}", "${data.Payment_Method}",${data.Donation_Amount}, ${data.Email_Sent}, STR_TO_DATE("${data.Date}", '%m/%d/%Y'))`;

		            console.log('theInsertDonationQuery: ',theInsertDonationQuery);
		             
		             connection.query(theInsertDonationQuery, function (err, result, fields) {
                        if (err){
                            handleDisconnect();
                            console.log('err: ',err);
                        }
                        console.log(result);
                    }); 
				}
			}); 



		//end of preliminary checks logic
	}

		//end of reading csv rows logic
	})

	.on("end", function(){
		console.log("done");
		return true;
});

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