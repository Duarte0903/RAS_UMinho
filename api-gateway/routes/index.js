var express = require('express');
var router = express.Router();

const Users = require('../services/Users')
//const Subscriptions = require('../services/Subscriptions')
//const Projects = require('../services/Projects')


router.post('/users/register', function (req, res, next) {
    console.log("body: ", req.body)
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    Users.register(name, email, password)
        .then((result) => {
            console.log("all good")
            res.jsonp(result);
        }).catch((err) => {
            console.log("error")
            res.status(500).jsonp({ msg: err.message });
        })
});

// Rotas de exemplo
/*router.get('/api/resource', (req, res) => {
    res.json({ message: 'Success!' });
});*/


module.exports = router