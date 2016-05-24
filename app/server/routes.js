
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var AD = require('./modules/admins-manager');
var EM = require('./modules/email-dispatcher');
//var SI = require('./modules/sms-inbound.js');
var url = require('url');

module.exports = function(app) {

// index page //
	app.get('/', function(req, res) { 
		var url_parts = url.parse(req.url,true).query;
		if(url_parts.msisdn){
			var textParts = url_parts.text.split(/_/);
			AM.updateLocation({
				device 	: url_parts.msisdn,
				lat 	: textParts[0],
				long 	: textParts[1],
				wlat	: 'test',
				wlong	: 'test',
				time 	: url_parts['message-timestamp']
			}, function(e, o){
				
			});
		}
		if(req.session.user == null) {
			res.render('index', { title: 'Campus Track'});
		} else if(req.session.user.height == null){
		// This would be an admin account //
			res.render('index', {
				title: 'Campus Track',
				name: req.session.user.name,
				admin: 'Yes'
			})
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
		} else if(req.session.user.height == null) {
			res.render('about', {
				title: 'Campus Track | About Us',
				name: req.session.user.name,
				admin: 'Yes'
			});
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
		var url_parts = url.parse(req.url,true);
		console.log(url_parts);
		res.statusCode = 200;
		if(req.session.user == null){
			res.render('demo', {
				scripts: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.js'], 
				styles: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.css'], 
				title: 'Campus Track | Demo'
			});
			res.end();
		} else if(req.session.user.height == null){
			res.render('demo', {
				name: req.session.user.name,
				scripts: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.js'], 
				styles: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.css'], 
				title: 'Campus Track | Demo',
				admin: 'Yes'
			});
		} else {
			res.render('demo', {
				name: req.session.user.name,
				scripts: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.js'], 
				styles: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.css'], 
				title: 'Campus Track | Demo'
			}); 
		}
		
	});



// main login page //
	app.get('/login', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		} else {
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/account');
				} else {
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

// admin login page - cannot remember //
	app.get('/adminLogin', function(req,res){
	// check for credentials in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('adminLogin', { title: 'Administrator Login' });
		} else {
			res.redirect('/adminHome');
		}
	});

	app.post('/adminLogin', function(req, res){
		AD.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			} else {
				req.session.user = o;
				res.status(200).send(o);
			}
		})
	});
	
// logged-in user demo //
	app.get('/accountDemo', function(req, res) {
		if (req.session.user == null){
		// if user is not logged-in redirect to login //
			res.redirect('/login');
		} else if(req.session.user.height == null){
		// redirect to admin map if admin //
			res.redirect('/adminDemo');
		} else {
			AM.getAccountByEmail(req.session.user.email, function(o) {
				res.render('demo', {
					title: 'Campus Track | Account Demo',
					name: req.session.user.name,
					scripts: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.js'],
					blScripts: ['/js/views/home.js', '/js/controllers/homeController.js'],
					styles: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.css'],
					udata : JSON.stringify(o)
				});
			});
			
		}
	});

	app.get('/adminDemo', function(req, res) {
		if (req.session.user == null || typeof(req.session.user.height) != 'undefined'){
			res.redirect('/');
		} else {
			AM.getAllRecords( function(e, accounts){
				res.render('demo', { 
					title : 'Campus Track | Administrator Map', 
					udata : JSON.stringify(accounts),
					name  : req.session.user.name,
					scripts: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.js'],
					blScripts: ['/js/views/home.js', '/js/controllers/homeController.js'],
					styles: ['https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.css'],
					admin : 'Yes'
				});
			});
		}
	});

	app.get('/demoUpdate', function(req, res) {
		if (req.session.user == null) {
			res.setHeader('Content-Type', 'application/json');
			res.send('notLogged');
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(req.session.user));
		}
	});




// logged-in user homepage //
	
	app.get('/account', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/login');
		} else if(req.session.user.height == null){
			res.render('adminHome', {
				name  : req.session.user.name,
				title : 'Administrator Info',
				udata : req.session.user,
				admin : 'Yes'
			});
		} else {
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

// create new admin //
	app.get('/adminSignup', function(req, res){
		res.render('adminSignup', { title: 'Admin Signup' });
	});

	app.post('/adminSignup', function(req, res){
		AD.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			phone 	: req.body['phone'],
			user 	: req.body['user'],
			pass 	: req.body['pass']
		}, function(e){
			if (e) {
				res.status(400).send(e);
			} else {
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
	
	app.get('/userList', function(req, res) {
	// only administrators can view the records page //
		if (req.session.user == null){
			res.redirect('/');
		} else if (req.session.user.height == null){
			AM.getAllRecords( function(e, accounts){
				res.render('print', { 
					title : 'Campus Track | Account List', 
					accts : accounts,
					name  : req.session.user.name,
					pstyl : ['/css/userList.css'],
					admin : 'Yes'
				});
			});
		} else {
			res.redirect('/');
		}
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
