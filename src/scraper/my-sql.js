"use strict";

const mysql  = require('mysql');
const config = require('../../config.json');
const Q      = require('q');
const process = require('process');

var connectionDb ;
if( process.env.ENV_NAME === "prod" ) {
  connectionDb = {
    "host"     : process.env.DB_HOST,
    "user"     : process.env.DB_USER,
    "password" : process.env.DB_PASSWORD,
    "database" : process.env.DB_NAME
  };
} else {
  connectionDb = config.db;
}

/**
 * [savePackageList description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function savePackageList(data) {

  var tsNow = Math.floor(new Date() / 1000);
  var records = data.map(function(item){
    return [ item.package_name, item.download, item.star, tsNow];
  });

  console.log(records);
  return Q.Promise(function(resolve, reject) {

    var mySqlClient = mysql.createConnection(connectionDb);

    var query = mySqlClient.query('INSERT INTO packagist_stat '
    +' (package_name, download, star, create_time) VALUES ?', [records], function (error, results, fields) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
        mySqlClient.end();
      }
    });
  });
}

exports.savePackageList = savePackageList;
