"use strict";

const request = require('request');
const cheerio = require('cheerio');
const Q = require('q');
/**
 */

/**
 * the 'download' and 'star' count contain space character and non ascci chars
 * like &thinsp; : we must remove them before being able to convert to int
 *
 * @param  {string} str thie string to convert to Int
 * @return {numeric}    integer value
 */
function convertToInt(str) {
  return parseInt(str.replace(/[^\x00-\x7F]/g, '').replace(" ", ""), 10);
}

/**
 * extract package name from the package page
 *
 * @param  {string} packageName ex: raoul2000/my-package
 * @return {object}             the extracted facts object
 */
function getPackageFacts(packageName) {
  return Q.Promise(function(resolve,reject){
    let url = "https://packagist.org/packages/" + packageName;

    request(url, function(error, response, html){
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);

        var downloadCount = $('.facts p:nth-child(1)').first().contents().filter(function() {
            return this.nodeType === 3;
        }).text().trim();

        var starCount = $('.facts p:nth-child(4)').first().contents().filter(function() {
            return this.nodeType === 3;
        }).text().trim();


        let result = {
          "package_name"  : packageName,
          "download"      : convertToInt(downloadCount),
          "star"          : convertToInt(starCount)
        };
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
}
exports.getPackageFacts = getPackageFacts;

/**
 * Extract facts for a list of packages
 * @param  {array} packageNames list of package names
 * @return {Promise}              the result of the promise is an array of package facts
 */
function getPackagesFacts(packageNames) {
  if( !Array.isArray(packageNames)) {
    throw "array of package names is expected";
  }
  let promises = packageNames.map(function(packageName){
    return getPackageFacts(packageName);
  });
  return Q.allSettled(promises)
  .then(function(result){
    return result.map(function(item){
      if(item.state === 'fulfilled') {
        return item.value;
      } else {
        return {};
      }
    });
  });
}
exports.getPackagesFacts = getPackagesFacts;

/**
* GEt the list of packages owned by a user
 *
 * @param  {string} authorName packge author name
 * @return {Promise}       the result
 */
function searchPackageByAuthor(authorName) {

  return Q.Promise(function(resolve,reject){

    let url = "https://packagist.org/packages/"+authorName+"/";
    let result = [];
    request(url, function(error, response, html) {
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(html);

            $('section.content > ul.packages > li.row').filter(function() {
                const row = $(this);

                let name = row.find('h4 > a ').text();
                let downloadCount = row.find('i.glyphicon-arrow-down ').parent().text();
                let starCount = row.find('i.glyphicon-star ').parent().text();

                result.push({
                    "package_name"  : name,
                    "download"      : convertToInt(downloadCount),
                    "star"          : convertToInt(starCount)
                });
            });
            console.log(result);
            resolve(result);
        } else {
          reject(error);
        }
    });
  }); // promise
}

exports.searchPackageByAuthor = searchPackageByAuthor;
