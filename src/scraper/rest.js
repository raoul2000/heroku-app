"use strict";
var client = require('restler'),
    axios  = require('axios'),
    Q      = require('q');

/**
 *
 * data : {
 * }
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function savePackageList(data) {

  var tsNow = Math.floor(new Date() / 1000);
  var requests = data.map(function(item){
    return function() {
      return axios.post("http://localhost/dev/yii2-rest-app/web/index.php?r=packagist/create", {
        "package_name" : item.package_name,
        "download" : item.download,
        "star" : item.star,
        "create_time" : tsNow
      });
    };
  });
  // TODO : continue
  axios.all(requests).
  then(function(result){

  })
  .catch(function(error){
    console.error(error);
  });
}

exports.savePackageList = savePackageList;
