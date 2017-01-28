var express = require('express');
var scraper = require('./src/scraper/index');
var Datastore = require('nedb');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));


app.get('/packagist/data', function(request, response) {
  var packageName = "raoul2000/yii-simple-workflow";

  var db = new Datastore("./data/packagist.raoul2000.json");
  db.loadDatabase();
  db.find({ "package.name" : packageName }, function(err, docs){
    if(err) {
      response.status(404).json(err);
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



app.get('/packagist', function(request, response) {
  scraper.packagist.searchPackage('raoul2000')
  .then(function(result){
    // prepare record
    var record = {
      'date_ts' : Date.now(),
      'package' : result
    };
    var db = new Datastore("./data/packagist.raoul2000.json");
    db.loadDatabase();
    db.insert(record,function(err,newDoc){
      if(err) {
        response.status(404).json(err);
      } else {
        response.status(200).json(result);
      }
    });
  })
  .fail(function(error){
    response.status(404).json(error);
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
