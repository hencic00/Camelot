var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');

var router = express.Router();

//Load all files in models folder
fs.readdirSync(__dirname + '/../models').forEach(function(filename)
{
	require(__dirname + '/../models/' + filename)
});



//----------------------Normal routes-----------------------------

router.get('/', function(req, res, next)
{
	res.render('home', {publicKey: 'ffeffeef'});
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
	var User = mongoose.model('users');

	var usr = new User
	(
		{
			eMail: req.body.eMail,
			password: req.body.passwd,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			dateOfBirth: req.body.dateOfBirth,
			sex: req.body.sex
		}
	);

	usr.save();

	res.send("ew2");
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


//----------------------------------------------------------------

module.exports = router;
