const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || "picturas";

// Middleware para validar o JWT
module.exports.validateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1]; // Remove o prefixo "Bearer"

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Token é válido; adiciona os dados descodificados ao objeto de requisição
        req.user = decoded;
        next();
    });
}