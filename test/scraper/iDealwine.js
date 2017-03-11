"use strict";

const request = require('request');
const cheerio = require('cheerio');
const assert = require('chai').assert;
const scraper = require('../../src/scraper/iDealwine.js');

describe('iDealwine scraper',function(done){

	it('extract data from package page',function(done){
		let packageName = "raoul2000/yii2-jcrop-widget";
		scraper.getWineFacts(packageName)
		.then(function(result){
			console.log(result);
			done();
		})
		.fail(function(error){
			done(error);
		})
	});
});
