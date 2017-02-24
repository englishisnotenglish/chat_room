//var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
//var routes = require('./routes/index');
//var users = require('./routes/users');
//var mongoose = require('mongoose');

var express = require('express');
var app = express();
var http = require('http');
var io = require('socket.io');
var server = http.createServer(app);

app.get('/', function(req, res){
  res.sendfile('./views/index.html');
});
server.listen(8080);
var count = 0;
var socket = io.listen(server);
socket.on('connection', function(socket){
  socket.on('message', function(data){
    console.log(data);
    socket.broadcast.emit('sendMessage', {message: data})
  });
  count++;
  socket.on('disconnect', function(){
    count--;
    socket.broadcast.emit('user', {number: count});
  });
});

//mongoose.connect('mongodb://localhost/test_demo', function(err){
//  if(!err){
//    console.log('successful');
//  }else {
//    throw err;
//  }
//});

//// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//
//// uncomment after placing your favicon in /public
////app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
//
//app.use('/', routes);
//app.use('/users', users);
//
//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});
//
//// error handlers
//
//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});


module.exports = app;
