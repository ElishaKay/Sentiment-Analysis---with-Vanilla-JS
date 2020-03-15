const mysql = require('mysql');
let {host,user,password,database} = require('../config/database').connection;

let pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: database,
    connectionLimit : 100, //important
    debug    :  false
});

module.exports = function executeSqlWithPool(SQLQuery){
    pool.getConnection(function(err,connection){
      if (err) {
        console.log(err);
        return;
      }  

      console.log('connected as id ' + connection.threadId);
     
      connection.query(SQLQuery,function(err,rows){
          connection.release();
          if(!err) {
              console.log(rows);
          }          
      });

      connection.on('error', function(err) {      
            if(err){
              console.log(err); 
            }
            return;    
      });
  });
}