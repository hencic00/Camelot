var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var redis = require("redis");
var redisClient = redis.createClient();

var routes = require('./routes/index');

var app = express();

//Server
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(function(req, res, next)
{
	res.io = io;
	next();
});

io.on('connection', function(client)
{
	// var data = cookieParser.JSONCookie(client.handshake.headers.cookie);
	redisClient.hget('onlineUsers', client.request._query['ime'], function(err, data)
	{
		if (data == null)
		{
			redisClient.hmset("onlineUsers", client.request._query['ime'], "1");
		}
		else 
		{
			var nmOfOpenPages = parseInt(data);
			redisClient.hmset("onlineUsers", client.request._query['ime'], ++nmOfOpenPages);
		}
	});

	client.on('disconnect', function ()
	{
		redisClient.hget('onlineUsers', client.request._query['ime'], function(err, data)
		{
			if (data == "1")
			{
				redisClient.hdel("onlineUsers", client.request._query['ime']);
			}
			else if(data != null)
			{
				var nmOfOpenPages = parseInt(data);
				redisClient.hmset("onlineUsers", client.request._query['ime'], --nmOfOpenPages);
			}
		});
	});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/favicons', 'favicon1.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//mongoose
mongoose.connect('mongodb://127.0.0.1:27017/Camelot');

//redis
// var client = redis.createClient();

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next)
{
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development')
{
	app.use(function(err, req, res, next)
	{
		res.status(err.status || 500);
		res.render('error',
		{
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next)
{
	res.status(err.status || 500);
	res.render('error',
	{
		message: err.message,
		error: {}
	});
});


module.exports = {app: app, server: server};