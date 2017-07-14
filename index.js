var express = require('express');
var bodyParser = require('body-parser');
var scraper = require('./src/scraper/index');
var Datastore = require('nedb');
var fs = require('fs');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
// parse application/json
app.use(bodyParser.json());

app.get('/app-info', function(request,response){
  var pkg = require('./package.json');
  response.status(200).json(pkg);
});
/**
 * [packageName description]
 * @type {String}
 */
app.get('/packagist/data', function(request, response) {
  var packageName = "raoul2000/yii-simple-workflow";
/*
  scraper.readPackageDataByName("raoul2000/yii-simple-workflow")
  .then(function(result){

  })
  .catch(function(error){
    response.status(500).json(error);

  });
  */
  var db = new Datastore("./data/packagist.raoul2000.json");
  db.loadDatabase();
  db.find({ "package.name" : packageName }, function(err, docs){
    if(err) {
      throw err;
    } else {
      var dataset = docs.map(function(doc){
        for (var i = 0; i < doc.package.length; i++) {
          if(doc.package[i].name === packageName ) {
            return {
              "date_ts"  : doc.date_ts,
              "download" : doc.package[i].download,
              "star"     : doc.package[i].star
            };
          }
        }
      });
      response.status(200).json({
        "package" : packageName,
        "dataset" : dataset
      });
    }
  });
});

/**
 *
 */
app.get('/packagist', function(request, response) {

  scraper.packagist.searchPackageByAuthor('raoul2000') // search packages belonging to a specific user
  .then(scraper.savePackageList)
  .then(function(result){
    response.status(200).json({
      "result" : result
    });
  })
  .fail(function(error){
    response.status(404).json(error);
  });
});

/**
 * {
 *  "url" : "http://www.domain.com/etc ..",
 *  "selector" : "div.title"
 * }
 */
app.post('/scraper/object', function(request, response) {
  console.log(request.body);
  // TODO : validate request body
  scraper.objects.getSelectorObject(
    request.body.url,
    request.body.selector,
    request.body.template
  )
  .then(function(result){
    response.status(200).json({ "result" : result });
  })
  .fail(function(error){
    response.status(500).json(error);
  });
});

app.post('/scraper', function(request, response) {
  console.log(request.body);
  // TODO : validate request body
  scraper.generic.getSelectorValue(request.body.url, request.body.selector)
  .then(function(result){
    response.status(200).json({ "result" : result });
  })
  .fail(function(error){
    response.status(500).json(error);
  });
});

/**
 *
 */
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
