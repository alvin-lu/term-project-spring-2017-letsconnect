// var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser = require('body-parser');
var socketIO = require('socket.io');
var path = require('path');
var logger = require('morgan');
var app = express();
// Setting up module for PostgreSQL to be utilized in NodeJS
var pg = require('pg');
pg.defaults.ssl = true;

var sess;

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/', function(req, res){

  console.log("Request body: " + req.body);
  console.log("First name: "+ req.body.fname);
  console.log("Last name:" + req.body.lname);
  console.log("Username:" + req.body.username);
  console.log("Email:" + req.body.email);
  console.log("Password:" + req.body.password);
  console.log("Database URL: " + process.env.DATABASE_URL);

  var fname = req.body.fname;
  var lname = req.body.lname;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");

    client.query('INSERT INTO users VALUES(DEFAULT, $1, $2, $3, $4, $5)', [fname, lname, username, email, password], function(err, result) {

      if (err) {
        return console.error('error running query', err);
      }
      done();
      res.redirect('/db');
    });
  });
});

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM users', function(err, result) {
      if (err)
      { console.error(err); response.send("Error " + err); }
      else
      { response.render('pages/db', {results: result.rows} ); }
      done();
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
