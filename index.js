/*const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
*/

var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
/********************************************/
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//var url = 'mongodb://localhost:27017/node-demo';//local DB
//var url='mongodb://ron:vitebsk@ds137019.mlab.com:37019/ronlavit' ;
var url= process.env.MONGOLAB_URI;

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(url);
var nameSchema = new mongoose.Schema({
 title: String,
 articleText:String,
 fullName: String
});
var Article = mongoose.model("Article", nameSchema);



/****************************************************/


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/****************************/
app.get('/articles',function(req,response){
  Article.find({},{_id:0,title:1,articleText:1,fullName:1}).limit(5).exec(function (err, articles) {
   if (err) return console.error(err);
   console.log(articles);

    response.render('pages/articles',{articles:articles});
 })

})
/******************************/

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var pg = require('pg');
/*
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});*/

app.post("/addname", (req, res) => {
  Article.find({}).exec(function(err,articles){
    if (err) return console.error(err);
    if(articles.length>=5){
        Article.findOneAndRemove().exec() ;
    }
  })
 var myData = new Article(req.body);
 myData.save()
 .then(item => {
 res.send("item saved to database");
 Article.find({},{_id:0,title:1,fullName:1}).exec(function (err, articles) {
  if (err) return console.error(err);
})
//Kitten.find({ name: /^Ron/ }, console.log);
 })
 .catch(err => {
 res.status(400).send("unable to save to database");
 });
});
