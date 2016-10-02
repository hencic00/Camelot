var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var NodeRSA = require('node-rsa');
var crypto = require('crypto-browserify');


//Load all files in models folder
fs.readdirSync(__dirname + '/../models').forEach(function(filename)
{
	require(__dirname + '/../models/' + filename)
});

//RSA setup
var keyPair = new NodeRSA({b: 512});
var publicKey = keyPair.exportKey('public');


var router = express.Router();
//----------------------Normal routes-----------------------------

router.get('/', function(req, res, next)
{
	var User = mongoose.model('users');

	if (req.cookies.eMail != undefined || req.cookies.loginHash != undefined)
	{

		User.findOne({eMail: req.cookies.eMail}, function(err, user)
		{
			if (user != null)
			{
				if (user.loginHash == req.cookies.loginHash)
				{
					res.render('home', {publicKey: publicKey, layout: false}); // User will encode all sensitive information with this public key
				}
				else
				{
					res.redirect('/login');
				}
			}
			else
			{
				res.redirect('/login');
			}
		});
	}
	else
	{
		res.redirect('/login');
	}

});

router.get('/login', function(req, res, next)
{
	res.render('login', {publicKey: publicKey, layout: false}); // User will encode all sensitive information with this public key
});


//----------------------------------------------------------------


//----------------------REST API-----------------------------

router.get('/users', function(req, res, next)
{
	mongoose.model('users').find(function(err, users)
	{
		res.send(users);
	});
});

router.post('/users', function(req, res)
{
	var key = keyPair.decrypt(decodeURIComponent(req.body.key), 'utf8');
	var decipher = crypto.createDecipher('aes-256-ctr', key);
	var dec = decipher.update(decodeURIComponent(req.body.json),'hex','utf8');
  	dec += decipher.final('utf8');
  	
  	

	var jsonData = JSON.parse(dec);

	var User = mongoose.model('users');

	var usr = new User
	(
		{
			eMail: jsonData.eMail,
			password: jsonData.passwd,
			firstName: jsonData.firstName,
			lastName: jsonData.lastName,
			dateOfBirth: jsonData.dateOfBirth,
			sex: jsonData.sex,
			loginHash: ""
		}
	);

	usr.save();

});

router.get('/users/:eMail', function(req, res, next)
{
	mongoose.model('users').find({eMail: req.params.eMail},function(err, users)
	{
		res.send(users);
	});
});

router.get('/userMailExists/:eMail', function(req, res, next)
{
	mongoose.model('users').find({eMail: req.params.eMail},function(err, users)
	{
		if (users.length > 0)
		{
			res.send(true);
		}
		else
		{
			res.send(false);
		}
		
	});
});

router.post('/authenticate', function(req, res)
{
	var key = keyPair.decrypt(decodeURIComponent(req.body.key), 'utf8');
	var decipher = crypto.createDecipher('aes-256-ctr', key);
	var dec = decipher.update(decodeURIComponent(req.body.json),'hex','utf8');
  	dec += decipher.final('utf8');

  	var jsonData = JSON.parse(dec);

	var User = mongoose.model('users');
	User.findOne({eMail: jsonData.eMail}, function(err, user)
	{
		if (user != null)
		{
			if (user.password == jsonData.passwd)
			{
				var hash = Math.random().toString(36).slice(2);
				user.loginHash = hash;
				user.save();


				var cipher = crypto.createCipher('aes-256-ctr',key)
				var crypted = cipher.update(hash,'utf8','hex')
				crypted += cipher.final('hex');

				res.send(crypted);
			}
			else
			{
				res.send(false);
			}
		}
		else
		{
			res.send(false);
		}
	});

});


//----------------------------------------------------------------

module.exports = router;
