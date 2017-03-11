"use strict";

const request = require('request');
const cheerio = require('cheerio');
const assert = require('chai').assert;
const scraper = require('../../src/scraper/packagist.js');

describe('packagist scraper',function(done){

	it('extract data from package page',function(done){
		let packageName = "raoul2000/yii2-jcrop-widget";
		scraper.getPackageFacts(packageName)
		.then(function(result){
			console.log(result);
			done();
		})
		.fail(function(error){
			done(error);
		})
	});


	it('extract facts for a list of packages ',function(done){

		scraper.getPackagesFacts([
			"raoul2000/yii2-jcrop-widget",
			"raoul2000/yii2-workflow",
			"raoul2000/yii2-bootswatch-asset"
		])
		.then(function(result){
			console.log(result);
			done();
		})
		.fail(function(error){
			done(error);
		})
	});
});
