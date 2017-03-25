"use strict";

const request = require('request');
const cheerio = require('cheerio');
const assert = require('chai').assert;
const scraper = require('../../src/scraper/objects.js');

describe('objects scraper',function(done){
	this.timeout(5000);

	//var selector = "#en_ce_moment li > a";
	var selector = ".titres_liste .grid_6.alpha > figcaption > h3";
	//var selector = "article > div div.title > h2.product-title > a > span";
	//var selector = "#en_ce_moment";
	var url = "http://www.lemonde.fr";
	//var url = "https://www.vinatis.com/top-vins-champagnes-meilleures-ventes-promo";

	it('extract values from  page',function(done){
		scraper.getSelectorObject(
			url,
			"article",
			[
				{ "name" : "title", "selector" : "a > h2.tt6"},
				{ "name" : "text", "selector"  : "p.txt3"},
				{ "name" : "url", "selector" : ".alpha.voir_plus > a"}
			]
		)
		.then(function(result){
			console.log(result);
			done();
		})
		.fail(function(error){
			done(error);
		})
	});

});
