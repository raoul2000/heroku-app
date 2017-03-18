"use strict";

const request = require('request');
const cheerio = require('cheerio');
const assert  = require('chai').assert;
const scraper = require('../../src/scraper/packagist.js');

describe('packagist scraper',function(done){
	 this.timeout(5000);
	it('extract package list for a username',function(done){
		let username = "raoul2000";
		scraper.searchPackageByAuthor(username)
		.then(function(result){
			console.log(result);
			done();
		})
		.fail(function(error){
			done(error);
		})
	});
});
