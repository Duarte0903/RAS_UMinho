const express = require('express');
const router = express.Router();
const { validateJWT } = require('../authentication/authentication');

const users = require('../services/users');
const subscriptions = require('../services/subscriptions');
const projects = require('../services/projects');


// ------------ USERS ------------


router.get('/users', validateJWT, function (req, res, next) {
    users.get_user_details(req.headers)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users/authenticate', function (req, res, next) {
    console.log("body: ", req.body);
    users.login_user(req.body.email, req.body.password)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users', function (req, res, next) {
    console.log("body: ", req.body)
    users.register_user(req.body.name, req.body.email, req.body.password)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.put('/users/name', validateJWT, function (req, res, next) {
    console.log("body: ", req.body)
    users.update_user_name(req.headers, req.body.name)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.put('/users/email', validateJWT, function (req, res, next) {
    console.log("body: ", req.body)
    users.update_user_email(req.headers, req.body.email)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.put('/users/password', validateJWT, function (req, res, next) {
    console.log("body: ", req.body)
    users.update_user(req.headers, req.body.password)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.delete('/users', validateJWT, function (req, res, next) {
    users.delete_user(req.headers)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.get('/users/days', validateJWT, function (req, res, next) {
    users.get_days(req.headers)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users/days', validateJWT, function (req, res, next) {
    users.add_days(req.headers)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});


// ------------ SUBSCRIPTIONS ------------


router.get('/users/subscriptions', validateJWT, function (req, res, next) {
    subscriptions.get_subscription(req.headers)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users/subscriptions', validateJWT, function (req, res, next) {
    console.log('body: ', req.body);
    subscriptions.create_subscription(
        req.headers,
        req.body.type,
        req.body.state
    ).then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.put('/users/subscriptions/:subs_id', validateJWT, function (req, res, next) {
    console.log('body: ', req.body);
    subscriptions.update_subscription(
        req.headers,
        req.params.subs_id,
        req.body.type,
        req.body.state
    ).then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.delete('/users/subscriptions/:subs_id', validateJWT, function (req, res, next) {
    subscriptions.delete_subscription(req.headers, req.params.subs_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.get('/users/subscriptions/:subs_id/payments', validateJWT, function (req, res, next) {
    subscriptions.get_payments(req.headers, req.params.subs_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users/subscriptions/:subs_id/payments', validateJWT, function (req, res, next) {
    console.log('body: ', req.body);
    subscriptions.create_payment(req.headers, req.params.subs_id, req.body.extra)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.put('/users/subscriptions/:subs_id/payments/:pay_id', validateJWT, function (req, res, next) {
    console.log('body: ', req.body);
    subscriptions.update_payment(req.headers, req.params.subs_id, req.params.pay_id, req.body.extra)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.delete('/users/subscriptions/:subs_id/payments/:pay_id', validateJWT, function (req, res, next) {
    subscriptions.delete_payment(req.headers, req.params.subs_id, req.params.pay_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});


// ------------ PROJECTS ------------


router.get('/users/projects', validateJWT, function (req, res, next) {
    projects.get_projects(req.headers)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users/projects', validateJWT, function (req, res, next) {
    console.log('body: ', req.body);
    projects.create_project(req.headers, req.body.name)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.put('/users/projects/:proj_id', validateJWT, function (req, res, next) {
    console.log('body: ', req.body);
    projects.update_project(req.headers, req.params.proj_id, req.body.name)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.delete('/users/projects/:proj_id', validateJWT, function (req, res, next) {
    projects.delete_project(req.headers, req.params.proj_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users/projects/:proj_id/images', validateJWT, function (req, res, next) {
    console.log('body: ', req.body);
    projects.upload_image(req.headers, req.params.proj_id, req.body.file)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.get('/users/projects/:proj_id/images', validateJWT, function (req, res, next) {
    projects.get_images(req.headers, req.params.proj_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.delete('/users/projects/:proj_id/images/:image_id', validateJWT, function (req, res, next) {
    projects.delete_image(req.headers, req.params.proj_id, req.params.image_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.get('/users/projects/:proj_id/tools', validateJWT, function (req, res, next) {
    projects.get_tools(req.headers, req.params.proj_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users/projects/:proj_id/tools', validateJWT, function (req, res, next) {
    console.log('body: ', req.body);
    projects.add_tool(
        req.headers,
        req.params.proj_id,
        req.body.position,
        req.body.procedure,
        req.body.parameters
    ).then((result) => {
        res.jsonp(result);
    }).catch((err) => {
        res.status(500).jsonp({ msg: err.message });
    })
});

router.put('/users/projects/:proj_id/tools/:tool_id', validateJWT, function (req, res, next) {
    console.log('body: ', req.body);
    projects.update_tool(
        req.headers,
        req.params.proj_id,
        req.params.tool_id,
        req.body.position,
        req.body.procedure,
        req.body.parameters
    ).then((result) => {
        res.jsonp(result);
    }).catch((err) => {
        res.status(500).jsonp({ msg: err.message });
    })
});

router.delete('/users/projects/:proj_id/tools/:tool_id', validateJWT, function (req, res, next) {
    projects.delete_tool(req.headers, req.params.proj_id, req.params.tool_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users/projects/:proj_id/process', validateJWT, function (req, res, next) {
    projects.trigger_process(req.headers, req.params.proj_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.get('/users/projects/:proj_id/status', validateJWT, function (req, res, next) {
    projects.process_status(req.headers, req.params.proj_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});


module.exports = router