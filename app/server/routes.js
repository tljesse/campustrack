
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
//var SI = require('./modules/sms-inbound.js');
var url = require('url');

module.exports = function(app) {

// index page //
	app.get('/', function(req, res) { 
		if(req.session.user == null) {
			res.render('index', { title: 'Campus Track'});
		} else {
			res.render('index', { 
				title: 'Campus Track',
				name: req.session.user.name
			});
		}
	});

// about page //
	app.get('/about', function(req, res) { 
		if(req.session.user == null) {
			res.render('about', { title: 'Campus Track | About Us'});
		} else {
			res.render('about', {
				title: 'Campus Track | About Us',
				name: req.session.user.name
			});
		}
	});

// contact page //
	app.get('/contact', function(req, res) { res.render('contact', { title: 'CampusTrack | Contact Us'}); });

// demo page //
	app.get('/demo', function(req, res) {
		if(req.session.user == null){
			res.render('demo', {
				scripts: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.js'], 
				styles: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.css'], 
				title: 'Campus Track | Demo'});
			res.end();
		} else {
			res.render('demo', {
				name: req.session.user.name,
				scripts: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.js'], 
				styles: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.css'], 
				title: 'Campus Track | Demo'}); 
		}
	});

// main login page //
	app.get('/login', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/account');
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/login', function(req, res){
		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				req.session.user = o;
				if (req.body['remember-me'] == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.status(200).send(o);
			}
		});
	});
	
// logged-in user demo //
	app.get('/accountDemo', function(req, res) {
		if (req.session.user == null){
			//if user is not logged-in redirect to login
			res.redirect('/login');
		} else {
			res.render('demo', {
				title: 'Campus Track | Account Demo',
				name: req.session.user.name,
				scripts: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.js'],
				blScripts: ['/js/views/home.js', '/js/controllers/homeController.js'],
				styles: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.css'],
				udata : req.session.user
			});
		}
	});

	app.get('/webhook', function(request, response){
		var url_parts = url.parse(request.url,true);

		console.log(url_parts.query.msisdn);
		res.sendfile('public/' + req.params.pagename + '.html');
	});


// logged-in user homepage //
	
	app.get('/account', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/login');
		}	else{
			res.render('home', {
				name: req.session.user.name,
				title : 'Control Panel',
				countries : CT,
				udata : req.session.user
			});
		}
	});
	
	app.post('/account', function(req, res){
		if (req.session.user == null){
			res.redirect('/login');
		}	else{
			AM.updateAccount({
				id		: req.session.user._id,
				name	: req.body['name'],
				email	: req.body['email'],
				height	: req.body['height'],
				weight	: req.body['weight'],
				phone	: req.body['phone'],
				pass	: req.body['pass'],
				country	: req.body['country']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.status(200).send('ok');
				}
			});
		}
	});

	app.post('/logout', function(req, res){
		res.clearCookie('user');
		res.clearCookie('pass');
		req.session.destroy(function(e){ res.status(200).send('ok'); });
	})
	
// creating new accounts //
	
	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT });
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			height	: req.body['height'],
			weight  : req.body['weight'],
			phone	: req.body['phone'],
			device	: req.body['device'],
			user 	: req.body['user'],
			pass	: req.body['pass'],
			country : req.body['country']
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.body['email'], function(o){
			if (o){
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// TODO add an ajax loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
					}
				});
			}	else{
				res.status(400).send('email-not-found');
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/login');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		var nPass = req.body['pass'];
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});
	
// view & delete accounts //
	
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});
	
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};
