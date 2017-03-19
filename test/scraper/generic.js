"use strict";

const request = require('request');
const cheerio = require('cheerio');
const assert = require('chai').assert;
const scraper = require('../../src/scraper/generic.js');

describe('generic scraper',function(done){
	this.timeout(5000);

	//var selector = "#en_ce_moment li > a";
	var selector = ".titres_liste .grid_6.alpha > figcaption > h3";
	//var selector = "article > div div.title > h2.product-title > a > span";
	//var selector = "#en_ce_moment";
	var url = "http://www.lemonde.fr";
	//var url = "https://www.vinatis.com/top-vins-champagnes-meilleures-ventes-promo";

	it('extract values from  page',function(done){
		scraper.getSelectorValue(
			url,
			selector
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
