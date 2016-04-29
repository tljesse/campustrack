
/**
	* Node.js Login Boilerplate
	* More Info : http://kitchen.braitsch.io/building-a-login-system-in-node-js-and-mongodb/
	* Copyright (c) 2013-2016 Stephen Braitsch
**/

var http = require('http');
var url = require('url');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(session({
	secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
	proxy: true,
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({ url: 'mongodb://tristan:google@ds021701.mlab.com:21701/heroku_k01txhjb' })//host: 'ds021701.mlab.com', port: 21701, db: 'dummyDB'})
	})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));

var nexmoService = require('./server/modules/nexmoService.js');
app.get('/services', nexmoService.querySms);

app.get('/webhook', function(request, response){
	var url_parts = url.parse(request.url,true);

	console.log(url_parts.query.msisdn);
	res.sendfile('public/' + req.params.pagename + '.html');
});

require('./app/server/routes')(app);

if (app.get('env') == 'development') app.use(errorHandler());


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
