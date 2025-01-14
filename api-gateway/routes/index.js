const express = require('express');
const router = express.Router();

const users = require('../services/users')
const subscriptions = require('../services/subscriptions')
const projects = require('../services/projects')


// ------------ USERS ------------


router.get('/users/:name', function (req, res, next) {
    users.get_user_by_name(req.query.name)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.get('/users/:email', function (req, res, next) {
    users.get_user_by_email(req.query.email)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users/register', function (req, res, next) {
    console.log("body: ", req.body)
    users.register_user(req.body.name, req.body.email, req.body.password)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.put('/users/:user_id', function (req, res, next) {
    console.log("body: ", req.body)
    users.update_user(req.query.user_id, req.body.name, req.body.email, req.body.password)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.delete('/users/:user_id', function (req, res, next) {
    users.delete_user(req.query.user_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.get('/users/:user_id/days', function (req, res, next) {
    users.get_todays_info(req.query.user_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});


// ------------ SUBSCRIPTIONS ------------


router.get('/users/:user_id/subscriptions', function (req, res, next) {
    subscriptions.get_subscription(req.query.user_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.put('/users/:user_id/subscriptions/:subs_id', function (req, res, next) {
    subscriptions.update_subscription(
        req.query.subs_id, 
        req.body.type, 
        req.body.state, 
        req.body.inserted_at
    )
    .then((result) => {
        res.jsonp(result);
    }).catch((err) => {
        res.status(500).jsonp({ msg: err.message });
    })
});

router.delete('/users/:user_id/subscriptions/:subs_id', function (req, res, next) {
    subscriptions.delete_subscription(req.query.subs_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.get('/users/:user_id/subscriptions/:subs_id/payments', function (req, res, next) {
    subscriptions.get_payments(req.query.subs_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users/:user_id/subscriptions/:subs_id/payments', function (req, res, next) {
    subscriptions.save_payment(req.query.subs_id, req.body.extra)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});


// ------------ PROJECTS ------------


router.get('/users/:user_id/projects', function (req, res, next) {
    projects.get_projects(req.query.user_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users/:user_id/projects', function (req, res, next) {
    console.log('body: ', req.body);
    projects.create_project(req.query.user_id, req.body.name)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.put('/users/:user_id/projects/:id', function (req, res, next) {
    console.log('body: ', req.body);
    projects.update_project(req.query.id, req.body.name)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.delete('/users/:user_id/projects/:id', function (req, res, next) {
    projects.delete_project(req.query.id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users/:user_id/projects/:proj_id/images', function (req, res, next) {
    console.log('body: ', req.body);
    projects.upload_images(req.query.proj_id, req.body.images)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.get('/users/:user_id/projects/:proj_id/images', function (req, res, next) {
    projects.get_images(req.query.proj_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.delete('/users/:user_id/projects/:proj_id/images/:image_id', function (req, res, next) {
    projects.delete_image(req.query.proj_id, req.query.image_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users/:user_id/projects/:proj_id/tools', function (req, res, next) {
    console.log('body: ', req.body);
    projects.add_tools(req.query.proj_id, req.body.tools)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.put('/users/:user_id/projects/:proj_id/tools/:tool_id', function (req, res, next) {
    console.log('body: ', req.body);
    projects.update_tool(
        req.query.proj_id, 
        req.query.tool_id, 
        req.body.position, 
        req.body.procedure, 
        req.body.parameters
    )
    .then((result) => {
        res.jsonp(result);
    }).catch((err) => {
        res.status(500).jsonp({ msg: err.message });
    })
});

router.delete('/users/:user_id/projects/:proj_id/tools/:tool_id', function (req, res, next) {
    projects.delete_tool(req.query.proj_id, req.query.tool_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.post('/users/:user_id/projects/:proj_id/process', function (req, res, next) {
    projects.trigger_process(req.query.proj_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.get('/users/:user_id/projects/:proj_id/status', function (req, res, next) {
    projects.process_status(req.query.proj_id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});


module.exports = router