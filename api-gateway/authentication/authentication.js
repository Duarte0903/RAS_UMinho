const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || "picturas";

const validateJWT = (req, res, next) => {
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

const restriction = (req, res, next) => {
    var user = req.user 
    var type = user["type"]
    var limits = {
        "anonimo": 5,
        "gratuito": 10,
        "premium": Infinity 
    }
    var max_operations = limits[type] ?? 5

    if (user["num_processes"] >= max_operations){
        return res.status(401).json({ error: "You have no more operations :c" });
    } 
    next();
}

const stopanonimo = (req, res, next) => {
    var user = req.user 
    var type = user["type"]

    if (type === "anonimo"){
        return res.status(401).json({ error: "I'm sorry no anonimos here." });
    } 
    next();
}

const stopRegistred = (req, res, next) => {
    var user = req.user 
    var type = user["type"]

    if (type !== "anonimo"){
        return res.status(401).json({ error: "I'm sorry, only anonimos here." });
    } 
    next();
}

// Middleware para validar o JWT
module.exports = {
    validateJWT : validateJWT,
    restriction : restriction,
    stopanonimo : stopanonimo,
    stopRegistred : stopRegistred
}
