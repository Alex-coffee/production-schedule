var DEFAULT_PORT = 8200;
var express  = require('express');
var app      = express();                               // create our app w/ express
//var mongoose = require('mongoose');                     // mongoose for mongodb
var Sequelize = require('sequelize');
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================
//var dbConfig = require('./config/db');
//mongoose.connect(dbConfig.url);
//var db = mongoose.connection;
//var dbConfig = require('./config/dbSequelize');
//var sequelize = new Sequelize(dbConfig.url);
//require('./config/dbInit')(sequelize);

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use("/resources", express.static(__dirname + '/resources'));
app.use("/modules", express.static(__dirname + '/node_modules'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser({limit: '5mb'}));
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// routes ==================================================
//require('./config/uploader')(app);
require('./api/plane-route')(app); // pass our application into our routes

var server = app.listen(DEFAULT_PORT, function(){
    console.log("App listening on port " + DEFAULT_PORT);
});

server.timeout = 600000;

exports = module.exports = app;