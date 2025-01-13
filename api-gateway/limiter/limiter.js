const { RateLimiterRedis } = require('rate-limiter-flexible');
const Redis = require('ioredis');
// usar Redis Sentinel em producao

const redisClient = new Redis({
    host: 'localhost', // Substitua pelo endereço do servidor Redis
    port: 6999,
});

// Configuração dos limites de rate para diferentes tipos de usuários
const rateLimiterCommon = new RateLimiterRedis({
    storeClient: redisClient,
    points: 100, // 100 requisições
    duration: 60, // por 60 segundos
    keyPrefix: 'rate-limit-common',
});

const rateLimiterPremium = new RateLimiterRedis({
    storeClient: redisClient,
    points: 1000, // 1000 requisições
    duration: 60, // por 60 segundos
    keyPrefix: 'rate-limit-premium',
});

// Middleware para aplicar o rate limiter
exports.rateLimiterMiddleware = async function (req, res, next) {
    const userType = req.headers['user-type'] || 'common'; // Exemplo: 'premium' ou 'common'
    const rateLimiter = userType === 'premium' ? rateLimiterPremium : rateLimiterCommon;

    try {
        await rateLimiter.consume(req.ip); // Use o IP do cliente como identificador
        next();
    } catch (rateLimiterRes) {
        res.set({
            'Retry-After': rateLimiterRes.msBeforeNext / 1000,
            'X-RateLimit-Limit': rateLimiter.points,
            'X-RateLimit-Remaining': rateLimiter.remainingPoints,
            'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString(),
        });
        res.status(429).json({ error: 'Too many requests' });
    }
}
