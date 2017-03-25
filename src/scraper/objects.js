"use strict";

const request = require('request');
const cheerio = require('cheerio');
const Q = require('q');

/**
 * [getSelectorObject description]
 * properties = {
 *  'name' : "proName",
 *  "selector" : "h2 > h1"
 * }
 * @param  {string} url        url
 * @param  {[type]} context    [description]
 * @param  {[type]} properties [description]
 * @return {[type]}            [description]
 */
function getSelectorObject(url, context, properties) {
  return Q.Promise(function(resolve,reject){

    request(url, function(error, response, html){
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        var objects = [];
        $(context).each(function(idx, ctx){
          var $ctx = $(this);
          var newObject = {};
          for (let i = 0; i < properties.length; i++) {
            var prop = properties[i];
            newObject[prop.name] = $ctx.find(prop.selector).text().trim();
          }
          objects.push(newObject);
        });
        resolve(objects);
      } else {
        reject(error);
      }
    });
  });
}
exports.getSelectorObject = getSelectorObject;
