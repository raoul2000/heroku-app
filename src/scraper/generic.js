"use strict";

const request = require('request');
const cheerio = require('cheerio');
const Q = require('q');

/**
 * Extracts and returns a signle value from a web page
 *
 * @param  {string} url      URL of the page to scrap
 * @param  {string} selector JQuery selector
 * @return {string}          the extracted value
 */
function getSelectorValue(url, selector) {
  return Q.Promise(function(resolve,reject){

    request(url, function(error, response, html){
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);

        var textContent = $(selector).map(function(idx,element){
          return $(this).text().trim();
        }).get();

        resolve(textContent);
      } else {
        reject(error);
      }
    });
  });

}
exports.getSelectorValue = getSelectorValue;
