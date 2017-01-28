"use strict";

const request = require('request');
const cheerio = require('cheerio');
const Q = require('q');

/**
 * Fetch package list for a given query string search criteria
 *
 * @param  {string} query the search criteria
 * @return {Promise}       the result
 */
function searchPackage(query) {

  return Q.Promise(function(resolve,reject){

    let url = "https://packagist.org/search/?q=" + query;
    let result = [];
    request(url, function(error, response, html) {
        if (!error && response.statusCode === 200) {
            /**
             * the 'download' and 'star' count contain space character and non ascci chars
             * like &thinsp; : we must remove them before being able to convert to int
             */
            const convertToInt = function(str) {
                return parseInt(str.replace(/[^\x00-\x7F]/g, '').replace(" ", ""), 10);
            };

            const $ = cheerio.load(html);

            $('div.search-list > ul.packages > li.row').filter(function() {
                const row = $(this);

                let name = row.find('h4 > a ').text();
                let downloadCount = row.find('i.glyphicon-arrow-down ').parent().text();
                let starCount = row.find('i.glyphicon-star ').parent().text();

                result.push({
                    "name"    : name,
                    "download": convertToInt(downloadCount),
                    "star"    : convertToInt(starCount)
                });
            });
            resolve(result);
        } else {
          reject(error);
        }
    });
  }); // promise
}

exports.searchPackage = searchPackage;
