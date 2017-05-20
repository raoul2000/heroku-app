"use strict";

const assert = require('chai').assert;
const miner = require('../../src/scraper/objectEx.js');

describe('objects scraper',function(done){

	it('extracts property with type text array',function(done){
		let result = miner.mine(
			{
				text : {
					selector : "b"
				}
			},
			"<p> text <b>bold</b> <b>other old</b> text</p>"
		);
		assert.deepEqual(result, { text : 'text bold text'});
		done();
	});

return;


	it('extracts property with type text',function(done){
		let result = miner.mine(
			{
				text : {
					selector : "p"
				}
			},
			"<p> text <b>bold</b> text</p>"
		);
		assert.deepEqual(result, { text : 'text bold text'});
		done();
	});

	return;
	it('extracts property with html type',function(done){
		let result = miner.mine(
			{
				text : {
					selector : "p",
					type : "html"
				}
			},
			"<p>lorem <b>ipsum</b> dolur</p>"
		);
		assert.deepEqual(result, { text : 'lorem <b>ipsum</b> dolur'});
		done();
	});

	it('extracts property from attribute value',function(done){
		let result = miner.mine(
			{
				class : {
					selector : "p",
					type : "@class"
				}
			},
			"<p class='front-page'>lorem <b>ipsum</b> dolur</p>"
		);
		assert.deepEqual(result, { class : 'front-page'});
		done();
	});

	it('extracts property having array value',function(done){
		let result = miner.mine(
			{
				boldText : {
					selector : "p > b",
				}
			},
			"<p>lorem <b>ipsum</b> dolur<b>other bold</b></p>"
		);
		assert.deepEqual(result, { class : 'front-page'});
		done();
	});

	it('extracts multiple properties',function(done){
		let result = miner.mine(
			{
				text : {
					selector : 'p'
				},
				class : {
					selector : "p",
					type : "@class"
				},
				htmlList : {
					selector : "p > ul > li"
				}
			},
			"<p class='front-page'>"
			+ "lorem <b>ipsum</b> dolur"+
			+ "<ul>"
				+ "<li>orange</li>"
				+ "<li>apple</li>"
			+ "</ul>"
			+ "</p>"
		);
		assert.deepEqual(result, { class : 'front-page'});
		done();
	});

});
