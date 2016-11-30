var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var URL = "YOUR URL HERE";
var USER = "YOUR USER HERE";
var PASS = "YOUR PASS HERE";

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver(URL, neo4j.auth.basic(USER, PASS));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




setInterval(makeRequest, 150+Math.random()*400);

function makeRequest() {
  //console.log("making request");
  var session = driver.session();
  session
      .run("MATCH (n) return (n)")
      .subscribe({
        onNext: function(record) {
          console.log(record._fields);
        },
        onCompleted: function() {
          // Completed!
          session.close();
        },
        onError: function(error) {
          console.log(error);
        }
      });

}

module.exports = app;
