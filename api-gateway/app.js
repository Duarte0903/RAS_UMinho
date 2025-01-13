var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

//const limiter = require('./limiter/limiter')

const indexRouter = require('./routes/index');

var app = express();

//app.use(cors({ origin: '*'}));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Limitar meio rudimentar por agora
// Set up rate limiter: maximum of one hundred requests per minute
const limiter = RateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 100,
});
// Apply rate limiter to all requests
app.use(limiter);

// TODO tentar implementar limiter mais complexo
// Adicionando o middleware ao app
//app.use(limiter.rateLimiterMiddleware);

app.use('/', indexRouter);


module.exports = app;