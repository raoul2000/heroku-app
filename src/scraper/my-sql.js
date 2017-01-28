var mysql = require('mysql');
var config = require('../../config.json')

var mySqlClient = mysql.createConnection(config.db);

var selectQuery = "select * from packagist_stat";

mySqlClient.query(selectQuery, function(error, results, fields){
  if(error) {
    console.error(error);
  } else if (results.length !== 0) {
    results.forEach(function(result){
      console.log(result.id);
    });
  } else {
    console.log("no result");
  }
  mySqlClient.end();
});
