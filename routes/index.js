var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next)
{
	res.render('home');
});

router.get('/NavBarTest', function(req, res, next)
{
	res.render('home1');
});

router.get('/login', function(req, res, next)
{
	res.render('loginSignUp', {layout: 'main1.handlebars', title: 'Login'});
});

module.exports = router;
