const express = require('express');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const indexRouter = require('./routes/index');

const app = express();

// Configuração do limitador
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 requisições por IP
    message: {
        error: "Too many requests",
        details: "You have exceeded the 100 requests in 15 minutes limit!"
    },
    standardHeaders: true, // Inclui informações de rate limit nos cabeçalhos `RateLimit-*`
    legacyHeaders: false,  // Desativa cabeçalhos obsoletos `X-RateLimit-*`
});

// Aplica o limitador globalmente
app.use(limiter);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);


module.exports = app;