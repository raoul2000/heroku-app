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

function applySelectorToHTML(html, selector) {
  //const $html = cheerio.load(html);
  //return $html(selector);
  return cheerio(selector,html);
}

function parseType(type){
  let result;
  if(type.startsWith('[') && type.endsWith(']')){
    result = {
      type : type.substring(1,type.length-2),
      isArray : true
    };
  } else {
    result = {
      type : type,
      isArray : false
    };
  }
  if( ["text", "html" ].indexOf(result.type) === -1 ) {
    throw new Error("invalid type value : "+type);
  }
  return result;
}

function extractPrimitiveValue(type, selector, html) {
  //console.log('extractPrimitiveValue type = '+type);
  console.log(cheerio(selector, html).length);
  const $ = cheerio.load(html);

  let result = null;
  try {
    if( type === 'text' ){
      result = parseString(cheerio(selector, html).text());
      /*
      console.log("text");
      result = [];
      $(selector).each(function(i,elem){
        result.push($(elem).text());
      });
      */
    }
    else if ( type === "html") {
      result = $(selector).html();
    }
    else if ( type.startsWith('@')) {
      result = parseString(cheerio(selector, html).attr(type.substring(1)));
    }
  } catch (e) {
    console.error("failed to extract primitive value");
    console.error(e);
  }
  return result;
}

function extractObject(model, html) {

  function extractProperty(model, html) {
    if( typeof model !== "object") {
      throw new Error("object expected");
    }

    if( model.hasOwnProperty('@object')) {
      return extractObject(model, html);
    } else if(model.hasOwnProperty('selector')) {
      var type = model.type || "text";
      return extractPrimitiveValue(type, model.selector, html);
    } else {
      throw new Error("invalid property model");
    }
  }
  
  /////////////////////////////////////////////////////////////////////////////
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
