// server.js

// set up ========================
// create our app w/ express
var express  = require('express');
var app      = express();

// mongoose for mongodb
var mongoose = require('mongoose');
// set the port
var port     = process.env.PORT || 8080;
// load the database config
var database = require('./config/database');

// log requests to the console (express4)
var morgan = require('morgan');
// pull information from HTML POST (express4)
var bodyParser = require('body-parser');
// simulate DELETE and PUT (express4)
var methodOverride = require('method-override');

// configuration =================
// database connection
mongoose.connect(database.url);

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
// log every request to the console
app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended':'true'}));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(methodOverride());

// load the routes
require('./app/routes')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
