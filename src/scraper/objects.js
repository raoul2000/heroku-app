"use strict";

const request = require('request');
const cheerio = require('cheerio');
const Q = require('q');

function parseString(val) {
  if(val) {
    return val.trim();
  } else {
    return null;
  }
}
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
function getSelectorObject(url, context, template) {
  return Q.Promise(function(resolve,reject){

    request(url, function(error, response, html){
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        var objects = [];
        $(context).each(function(idx, ctx){
          var $ctx = $(this);
          var newObject = {};

          // loop on eahc property of he template object
          for (var i = 0; i < Object.keys(template).length; i++) {
            var propName = Object.keys(template)[i];
            var propValue = template[propName];
            var value = null;

            // try to extract the value of the current property
            try {
              if(  ! propValue.hasOwnProperty('value') || propValue.value === "text" ){
                // default : value === "text" - type = text
                value = parseString($ctx.find(propValue.selector).text());
              }
              else if ( propValue.value === "html") {
                value = $ctx.find(propValue.selector).html();
              }
              else if (propValue.value.startsWith('@')) {
                value = parseString($ctx.find(propValue.selector).attr(propValue.value.substring(1)));
              }
            } catch (e) {
              console.error("failed to extract value for property "+propName);
            }
            newObject[propName] = value;
          } // end for

          // validate the newly created object

          var valid = true;
          for (var i = 0; i < Object.keys(newObject).length; i++) {
            var propName = Object.keys(newObject)[i];
            if( ! newObject[propName] ) {
              valid=false;
              break;
            }
          }

          if( valid ) {
            objects.push(newObject);
          }
        });
        resolve({
          "baseUrl" : url,
          "objects" : objects
        });
      } else {
        reject(error);
      }
    });
  });
}

exports.getSelectorObject = getSelectorObject;


function getSelectorObject_orig(url, context, properties) {
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
            var value;
            console.log(prop.value);
            if(prop.value === "undefined" || prop.value === "text") {
              value = $ctx.find(prop.selector).text().trim();
            } else if (prop.value.startsWith('@')) {
              value = $ctx.find(prop.selector).attr(prop.value.substring(1)).trim();
            }
            newObject[prop.name] = value;
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
