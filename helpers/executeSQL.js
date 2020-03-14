let mysql = require('mysql');
let dbconfig = require('../config/database');
let connection = mysql.createConnection(dbconfig.connection);
let handleDisconnect = require('./handleDisconnect');

module.exports = function executeSQL(theQuery) { 
  connection.query(theQuery, function (err, result, fields) {
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