var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var NodeRSA = require('node-rsa');
var crypto = require('crypto-browserify');
var validate = require('./validacija.js');
var redis = require("redis");

var client = redis.createClient();

//Load all files in models folder
fs.readdirSync(__dirname + '/../models').forEach(function(filename)
{
	require(__dirname + '/../models/' + filename)
});

//RSA setup
var keyPair = new NodeRSA({b: 512});
var publicKey = keyPair.exportKey('public');


//---------------------Functions to be placed in seprate files-----------------------
function isLoggedIn(cookies, callIfLoggedIn, callIfNotLoggedIn)
{
	if (cookies.eMail && cookies.loginHash)
	{
		var User = mongoose.model('users');
		User.findOne({eMail: cookies.eMail}, function(err, user)
		{
			if (user)
			{
				if (user.loginHash == cookies.loginHash)
				{
					callIfLoggedIn();
				}
				else
				{
					callIfNotLoggedIn();
				}
			}
			else
			{
				callIfNotLoggedIn();
			}
		});
	}
	else
	{
		callIfNotLoggedIn();
	}
}

function decrypt(pubKey, json)
{
	var key = keyPair.decrypt(decodeURIComponent(pubKey), 'utf8');
	var decipher = crypto.createDecipher('aes-256-ctr', key);
	var dec = decipher.update(decodeURIComponent(json),'hex','utf8');
  	dec += decipher.final('utf8');

  	return dec;
}

function toGameState(vnos)
{
	var vrstice = vnos.split('/');
	var izhod = "";
	// console.log(vnos);

	izhod = "XXXXXXXXXXXXXX";
	izhod += "XXXXXX" + vrstice[0] + "XXXXXX";
	izhod += "XXX" + vrsticaFromHJN(vrstice[1]) + "XXX";
	izhod += "XX" + vrsticaFromHJN(vrstice[2]) + "XX";
	for (var i = 3; i < vrstice.length - 3; ++i)
	{
	    izhod += "X" + vrsticaFromHJN(vrstice[i]) + "X";
	}
	izhod += "XX" + vrsticaFromHJN(vrstice[13]) + "XX";
	izhod += "XXX" + vrsticaFromHJN(vrstice[14]) + "XXX";
	izhod += "XXXXXX" + vrsticaFromHJN(vrstice[15]) + "XXXXXX";
	izhod += "XXXXXXXXXXXXXX";
	return izhod;
};

function vrsticaFromHJN(vrstica)
{
	var izhod = "";
	var prazna = "";
	var i = 0;
	for(i = 0; i < vrstica.length; ++i)
	{
		while(i < vrstica.length && !isNaN(parseInt(vrstica[i],10)))
		{
			prazna += vrstica[i];
			++i;
		}
		if(prazna != "")
		{
			prazna = parseInt(prazna,10);
			while(prazna > 0)
			{
				izhod += "O";
				--prazna;
			}
			prazna="";
		}
		if(i < vrstica.length)
		{
			izhod += vrstica[i];
		}
	}
	return izhod;
};


var router = express.Router();
//----------------------Normal routes-----------------------------

router.get('/', function(req, res, next)
{
	isLoggedIn(
		req.cookies, 
		function(){res.render('home', {publicKey: publicKey, layout: false})}, 
		function(){res.redirect('/login')}
	);

});

router.get('/login', function(req, res, next)
{
	isLoggedIn(
		req.cookies, 
		function(){res.redirect('/')},
		function(){res.render('login', {publicKey: publicKey, layout: false})} 
	);
});




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
	var dec = decrypt(req.body.key, req.body.json);
  	
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

router.get('/possibleMoves', function(req, res, next)
{

	var prevMove = {val: null}; 
	var prevFig = {val: null};
	var details = {val: ""};
	var castleMoves = {val: 0};

	var data = JSON.parse(req.query.json);
	const gameBoard = { val: toGameState(data.hjn)};

	// console.log(data.hjn);

	var premiki = validate.mozniPremikiAI(gameBoard, data.pos, data.castle, data.prevFig, data.prevMove, data.castleMoves);
	res.send(JSON.stringify(premiki));
	// console.log(premiki);
	// res.send(req.query.json);
});

router.get('/Ples', function(req, res, next)
{
	client.get('tutorialspoint', function(err, reply)
	{
    	res.send(reply);
	});
	
});

router.get('/validate', function(req, res)
{
	var data = JSON.parse(req.query.data);
	

	var gameState = {val: toGameState(data.hjn)};

	var premik = (data.src.y + 1) + ',' + (data.src.x + 1) + '>' + (data.dest.y + 1) + ',' + (data.dest.x + 1);
	console.log(premik);
	var prevMove = {val: null}; 
	var prevFig = {val: null};
	var details = {val: ""};
	var castleMoves = {val: 0};


	var result = validate.validiraj(premik, gameState, prevMove, prevFig, data.castle, details, castleMoves);
	var send = null;


	if (result)
	{
		send = 
		{
			status: true,
			prevMove: prevMove,
			prevFig: prevFig,
			details: details,
			castleMoves: castleMoves
		};
	}
	else
	{
		send = 
		{
			status: false,
			prevMove: null,
			prevFig: null,
			details: null,
			castleMoves: null
		};
	}

	// console.log(data.castle);

	res.send(send);

});

router.post('/iMoovedMyPiece', function(req, res)
{
	var data = JSON.parse(req.body.data);
	

	client.hget("enemies", data.myName, function (err, obj)
	{
		res.io.emit(obj, {action: 'moviePiece', src: data.src, dest: data.dest});
	});

	res.send("Forwarded");

});

router.post('/endTurn', function(req, res)
{
	var data = JSON.parse(req.body.data);
	

	client.hget("enemies", data.myName, function (err, obj)
	{
		res.io.emit(obj, {action: 'startTurn'});
	});

	res.send("Forwarded");

});


router.post('/lookingForGame', function(req, res)
{
	var json = JSON.parse(req.body.json);
	client.lpush("lookingForGame", json.name);
	client.lrange('lookingForGame', 0, 10, function(err, reply)
	{
    	if (reply.length > 1) 
    	{
			client.rpop('lookingForGame', function (err, user)
			{
				client.rpop('lookingForGame', function (err, user1)
				{
					res.io.emit(user, {action:'startGame', team: '+', yourTurn: true});
					res.io.emit(user1, {action:'startGame', team: '-', yourTurn: false});

					client.hmset("enemies", user, user1);
					client.hmset("enemies", user1, user);
					res.send('found');
				});
			});
			
    	} 
	});


});



//----------------------------------------------------------------

module.exports = router;
