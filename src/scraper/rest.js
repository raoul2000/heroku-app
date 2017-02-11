"use strict";
var axios  = require('axios');

/**
 *
 * data = [
 *  { package_name: 'raoul2000/yii-simple-workflow', download: 309,  star: 24 },
*   { package_name: 'raoul2000/yii2-jcrop-widget',  download: 9442,  star: 7 },
*   etc...
*  ]
*
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function savePackageList(data) {

  var baseURL = "http://localhost/dev/yii2-rest-app/web"; // default
  if( process.env.ENV_NAME === "prod" ) {
    baseURL = process.env.REST_BASE_URL;
  }

  var tsNow = Math.floor(new Date() / 1000);
  var requests = data.map(function(item){
      return axios.post( baseURL+"/index.php?r=packagist/create", {
        "package_name" : item.package_name,
        "download"     : item.download,
        "star"         : item.star,
        "create_time"  : tsNow
      });
  });
  return axios.all(requests)
  .then(function(result){
    console.log(result);
    return "ok";
  })
  .catch(function(error){
    console.error(error);
  });
}

exports.savePackageList = savePackageList;
