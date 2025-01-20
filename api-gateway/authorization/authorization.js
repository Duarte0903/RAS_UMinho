
const max_operations = (req, res, next) => {
    var user = req.user 
    var type = user["type"]
    var limits = {
        "anonimo": 5,
        "gratuito": 10,
        "premium": Infinity 
    }
    var max_ops = limits[type] ?? 5

    if (user["num_processes"] >= max_ops){
        return res.status(401).json({ error: "You have no more operations :c" });
    } 
    next();
}

const stop_anonimo = (req, res, next) => {
    var user = req.user 
    var type = user["type"]

    if (type === "anonimo"){
        return res.status(401).json({ error: "I'm sorry no anonimos here." });
    } 
    next();
}

const stop_registred = (req, res, next) => {
    var user = req.user 
    var type = user["type"]

    if (type !== "anonimo"){
        return res.status(401).json({ error: "I'm sorry, only anonimos here." });
    } 
    next();
}

const block_advanced = (req, res, next) => {
    var user = req.user
    var type = user["type"]
    var kind = req.body.kind

    if (type !== "premium" && kind === 'advanced') {
        return res.status(401).json({ error: "Only premium users can use premium tools, sir." });
    } 
    next();
}

// Middleware to grant/deny permission to users
module.exports = {
    max_operations: max_operations,
    stop_anonimo: stop_anonimo,
    stop_registred: stop_registred,
    block_advanced: block_advanced
}