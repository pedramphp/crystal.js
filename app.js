"use strict";

var express = require('express'),
    exphbs  = require('express-handlebars'), // "express-handlebars"
    helpers = require('./src/helpers'),
    routes = require("./src/routes");

var app = express();

var bodyParser = require('body-parser');

var VIEW_EXT_NAME = ".hbs";

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers      : helpers.templates,

    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [
        'shared/templates/',
        'views/partials/'
    ],
    extname: VIEW_EXT_NAME
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine(VIEW_EXT_NAME, hbs.engine);

app.set('view engine', VIEW_EXT_NAME);

app.use(bodyParser.json()); // for parsing application/json

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.get('/', function(req, res, next){ 

    helpers.exposeTemplates(app, hbs, req, res, next);

}, routes.home);

app.use(express.static('public/'));


if(!process.env.NODE_ENV){
    process.env.NODE_ENV = "development";
}

var server_port =  process.env.PORT || 3000;
var server_ip_address = process.env.HOST || '127.0.0.1';
 
if(!app.get('port')){
    app.set('port', server_port);
}

app.listen(app.get('port'), function () {
    console.log('Server listening on: '+ app.get('port'));
});