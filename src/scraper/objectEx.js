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
 * Parse the type definition string passed as argumet.
 * Valid avlues for type : "text", "[text]", "html", "[html]", "@attr"
 * Example :
 *   - type = "[text]"
 *   - result = {
 *      type : "text",
 *      isArray : true
 *     }
 *
 * @param  {string} type the type definition
 * @return {object}      the parsed type
 */
function parseType(type){
  let result;
  if(type.startsWith('[') && type.endsWith(']')){
    result = {
      type    : type.substring(1,type.length-1),
      isArray : true
    };
  } else {
    result = {
      type    : type,
      isArray : false
    };
  }
  if( ! result.type.startsWith('@') &&
     ["text", "html" ].indexOf(result.type) === -1 )
  {
    throw new Error("invalid type value : "+type);
  }
  return result;
}

function extractPrimitiveValue(valueDef, selector, html) {
  //console.log(cheerio(selector, html).length);
  const $ = cheerio.load(html);

  let result = null;
  try {
    if( valueDef.type === 'text' ){
      if( valueDef.isArray === true) {
        result = [];
        $(selector).each(function(i,elem){
          result.push($(elem).text());
        });
      } else {
        result = parseString($(selector).text());
      }
    }
    else if ( valueDef.type === "html") {
      if( valueDef.isArray === true) {
        result = [];
        $(selector).each(function(i,elem){
          result.push($(elem).html());
        });
      } else {
        result = $(selector).html();
      }
    }
    else if ( valueDef.type.startsWith('@')) {
      let attrName = valueDef.type.substring(1);
      if( valueDef.isArray === true) {
        result = [];
        $(selector).each(function(i,elem){
          result.push($(elem).attr(attrName));
        });
      } else {
        result = $(selector).attr(attrName);
      }
    }
  } catch (e) {
    console.error("failed to extract primitive value");
    console.error(e);
  }
  return result;
}

function extractProperty(model, html) {
  
  if( typeof model !== "object") {
    throw new Error("object expected");
  }
  else if( ! model.hasOwnProperty('selector')) {
    throw new Error("missing selector");
  }
  var type = model.type || "text";

  if( typeof type === 'string') {
    let parsedType = parseType(type);
    return extractPrimitiveValue(parsedType, model.selector, html);
  }
  else if( typeof type === 'object') {
    const $ = cheerio.load(html);
    let objects = [];
    $(model.selector).each(function(i,elem){
      objects.push(
        extractObject(model.type, $(elem).html())
      );
    });
    return objects;
  } else {
    throw new Error("invalid property model "+ JSON.stringify(model));
  }
}


function extractProperty_orig(model, html) {
  console.log(model);
  if( typeof model !== "object") {
    throw new Error("object expected");
  }

  if( model.hasOwnProperty('@object')) {
    return extractObject(model['@object'], html);
  } else if(model.hasOwnProperty('selector')) {
    var type = model.type || "text";
    let parsedType = parseType(type);
    return extractPrimitiveValue(parsedType, model.selector, html);
  } else {
    throw new Error("invalid property model "+ JSON.stringify(model));
  }
}

function extractObject(model, html) {
  var result = {};
  for (var i = 0; i < Object.keys(model).length; i++) {
    var propName  = Object.keys(model)[i];
    var propDef   = model[propName];

    result[propName] = extractProperty(propDef, html);
  }
  return result;
}

exports.mine = function(model, html) {
  return extractObject(model, html);
};
