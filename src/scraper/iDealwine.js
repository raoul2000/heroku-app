"use strict";

const request = require('request');
const cheerio = require('cheerio');
const Q = require('q');

function convertToInt(str) {
  return parseInt(str.replace(/[^\x00-\x7F]/g, '').replace(" ", ""), 10);
}

/**
 * extract package name from the package page
 *
 * @param  {string} packageName ex: raoul2000/my-package
 * @return {object}             the extracted facts object
 */
function getWineFacts(packageName) {
  return Q.Promise(function(resolve,reject){
    let url = "https://www.idealwine.com/fr/acheter-vin/B2064624-912-1-Bouteille-Alsace-1er-Cru-Burlenberg-Marcel-Deiss-Domaine-La-Colline-Brulee-2011-Rouge.jsp";
    // "https://www.idealwine.com/fr/acheter-vin/B2064624-933-1-Bouteille-100-riesling-Grand-Cru-Wineck-Schlossberg-Meyer-Fonne-Domaine-2013-Blanc.jsp";

    request(url, function(error, response, html){
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);

        var prix = $('#input_prix').first().contents().filter(function() {
            return this.nodeType === 3;
        }).text().trim();

        var wineName = $('h1').first().contents().filter(function() {
            return this.nodeType === 3;
        }).text().trim();

        let result = {
          "wine_name"  : wineName,
          "prix"       : convertToInt(prix)
        };
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
}
exports.getWineFacts = getWineFacts;
