var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
var jwt = require('jsonwebtoken')
var passport = require('passport')
var userModel = require('../models/user')

var User = require('../controllers/user');

const verify = function(req, res, next) {
    var token = req.query.token || req.body.token
    if (token) {
        jwt.verify(token, 'RAS2025', function(err, payload) {
            if (err) {
                res.status(401).jsonp({error: 'Token not valid'});
            } else {
                next();
            }
        });
    }

    else {
        res.status(401).jsonp({error: 'Token not found'});
    }
}

// POST /register
router.post('/register', function(req, res) {
  console.log(req.body);
  const newUser = new userModel({ 
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    level: 'free'
  });

  userModel.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.error("Registration error:", err);
      return res.status(409).jsonp({ error: err, message: "Register error: " + err });
    }

    else {
      console.log("User registered successfully");
      res.status(201).jsonp({ message: "User registered successfully" });
    }
  });
});

// POST /login
router.post('/login', function(req, res, next) {
  // Check if request body has email and password
  if (!req.body.email || !req.body.password) {
    console.error("Email or password not provided");
    return res.status(400).jsonp({ error: 'Email and password are required' });
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.error("Error during authentication:", err);
      return res.status(500).jsonp({ error: err.message });
    }
    if (!user) {
      console.error("Authentication failed:", info ? info.message : 'No user');
      return res.status(401).jsonp({ error: 'Authentication failed: ' + (info ? info.message : 'No user') });
    }


    req.logIn(user, async function(err) {
      if (err) {
        console.error("Error during login:", err);
        return res.status(500).jsonp({ error: err.message });
      }

      try {
        const foundUser = await User.lookUpEmail(user.email);
        
        // Create JWT token
        jwt.sign({
          _id: foundUser._id,
          email: foundUser.email, 
          type: foundUser.type, 
          sub: 'RAS'
        }, 
        "RAS2025",
        { expiresIn: 3600 },
        function(err, token) {
          if (err) {
            console.error("Error generating token:", err);
            return res.status(500).jsonp({ error: "Erro na geração do token: " + err });
          }
          console.log("User logged in successfully");
          console.log(foundUser);
          res.status(201).jsonp({ token: token });
        });
      } catch (err) {
        console.error("Error finding user:", err);
        return res.status(500).jsonp({ error: err.message });
      }
    });
  })(req, res, next);
});

// POST /password
router.post('/password', verify, function(req, res) {
  if (!req.body.email || !req.body.password || !req.body.newPassword) {
    console.error("Email, password, and newPassword are required");
    return res.status(400).jsonp({ error: 'Email, password, and newPassword are required' });
  }

  passport.authenticate('local', async function(err, user, info) {
    if (err) {
      console.error("Error during authentication:", err);
      return res.status(500).jsonp({ error: err.message });
    }

    if (!user) {
      console.error("Authentication failed:", info ? info.message : 'No user');
      return res.status(401).jsonp({ error: 'Authentication failed: ' + (info ? info.message : 'No user') });
    }

    try {
      await user.setPassword(req.body.newPassword);
      
      await user.save();
      
      console.log(user)
      
      console.log("Password updated successfully");
      res.status(200).jsonp({ message: "Password updated successfully" });
    } catch (err) {
      console.error("Error setting new password:", err);
      return res.status(500).jsonp({ error: err.message });
    }
  })(req, res);
});

// DELETE /:_id
router.delete('/:_id', verify, function (req, res) {
  User.remove(req.params._id)
    .then(dados => res.status(200).jsonp({dados}))
    .catch(erro => res.status(500).jsonp({error: erro}))
});

module.exports = router;