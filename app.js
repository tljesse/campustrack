
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

require('./app/server/routes')(app);

if (app.get('env') == 'development') app.use(errorHandler());


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));

	if(request.method=='POST') {
      //Do something for post request
  }
  else if(request.method=='GET') {
      //Check that this is a delivery receipt
      var url_parts = url.parse(request.url,true);

      if (!url_parts.hasOwnProperty('to') || !url_parts.hasOwnProperty('msisdn') || !url_parts.hasOwnProperty('text'))
        console.log('This is not an inbound message');
      else {
        //This is a DLR, check that your message has been delivered correctly
        if (url_parts.hasOwnProperty('concat'))
        {
          console.log("Fail:" +  url_parts.status + ": " + url_parts.err-code  +  ".\n" );
        }
        else {
          console.log("Success");
          /*
           * The following parameters in the delivery receipt should match the ones
           * in your request:
           * Request - from, dlr - to\n
           * Response - message-id, dlr - messageId\n
           * Request - to, Responese - to, dlr - msisdn\n
           * Request - client-ref, dlr - client-ref\n
           */
        }

      }
  }
  //Send the 200 ok to the Platform so you don't get sent the DLR again.
  response.writeHead(200, {"Content-Type": "text/html"});
  response.end();
});
