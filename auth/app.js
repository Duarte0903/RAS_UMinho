var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var logger = require('morgan');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/ras';
mongoose.connect(mongoDB, {
    serverSelectionTimeoutMS: 5000
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB on port 27017");
});

// config passport
var User = require('./models/user');
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var usersRouter = require('./routes/user');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up express-session middleware
app.use(session({
    secret: 'RAS2025',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.jsonp({ error: err });
});

module.exports = app;