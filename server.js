// Include Server Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongojs = require('mongojs');

// Create Instance of Express
var app = express();
var PORT = process.env.PORT || 8080; // Sets an initial port. We'll use this later in our listener
 
// Run Morgan for Logging
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

app.use(express.static('./public'));

// -------------------------------------------------

// MongoDB Configuration configuration (Change this URL to your own DB)
var databaseUrl = 'nytreact';
var collections = ["searches"];

// use mongojs to hook the database to the db variable 
var db = mongojs(databaseUrl, collections);

db.on('error', function (err) {
  console.log('MongoDB Error: ', err);
});


// -------------------------------------------------

// Main Route. This route will redirect to our rendered React application
app.get('/', function(req, res){
  res.sendFile('./public/index.html');
})

// This is the route we will send GET requests to retrieve our most recent search data.
// We will call this route the moment our page gets rendered
app.get('/api/saved', function(req, res) {

  // We will find all the records, sort it in descending order, then limit the records to 5
  db.searches.find({}).sort({date: -1}).limit(5, function(err, doc){

      if(err){
        console.log(err);
      }
      else {
        res.send(doc);
      }
    })
});

// This is the route we will send POST requests to save each search.
app.post('/api/saved', function(req, res){
  console.log("BODY: " + req.body.title);
  console.log("DATE: " + req.body.date);
  console.log("URL: " + req.body.url);

  // Here we'll save the title based on the JSON input. 
  // We'll use Date.now() to always get the current date time
  db.searches.insert({"title": req.body.title, "date": req.body.date, "url": req.body.url}, function(err){
    if(err){
      console.log(err);
    }
    else {
      res.send("Saved Search");
    }
  })
});

// This is the route we will send DELETE requests to delete each search the user decides to delete.
// app.delete('/api/saved', function(req, res){
//   console.log("BODY: " + req.body.title);

//   // Here we'll delete the article based on the JSON input. 
//   // We'll use Date.now() to always get the current date time
//   db.searches.deleteOne({"title": req.body.title, "date": Date.now()}, function(err){
//     if(err){
//       console.log(err);
//     }
//     else {
//       res.send("Deleted Search");
//     }
//   })
// });


// -------------------------------------------------

// Listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
