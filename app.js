const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUI = require("swagger-ui-express");
const docs = require('./docs');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const todoRouter = require('./routes/todos');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//example to use multiple allowed origins
// const allowList = ['http://localhost:4000'];
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (allowList.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }
// app.use(cors(corsOptionsDelegate));

// use cors for all of the routes
app.use(cors({origin: 'http://localhost:3000'}));

//use cors for just one route
//app.get([url], cors(corsOptions),[res callback]);

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/todo', todoRouter);

//set up swagger to serve on /api-docs, and setup the service from the docs folder
app.use('/',swaggerUI.serve, swaggerUI.setup(docs));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
