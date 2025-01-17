const express = require('express');
const router = express.Router();
const { validateJWT } = require('../authentication/authentication');

const users = require('../services/users');
const subscriptions = require('../services/subscriptions');
const projects = require('../services/projects');

// Helper function to handle errors
function handleError(res, err) {
    const statusCode = err.status || 500;
    res.status(statusCode).jsonp({ msg: err.message });
}

// ------------ USERS ------------

router.get('/api/users', validateJWT, function (req, res) {
    users.get_user_details(req.headers)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.post('/api/users/authenticate', function (req, res) {
    users.login_user(req.body.email, req.body.password)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.post('/api/users', function (req, res) {
    users.register_user(req.body.name, req.body.email, req.body.password)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.put('/api/users/name', validateJWT, function (req, res) {
    users.update_user_name(req.headers, req.body.name)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.put('/api/users/email', validateJWT, function (req, res) {
    users.update_user_email(req.headers, req.body.email)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.put('/api/users/password', validateJWT, function (req, res) {
    users.update_user(req.headers, req.body.password)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.delete('/api/users', validateJWT, function (req, res) {
    users.delete_user(req.headers)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.get('/api/users/days', validateJWT, function (req, res) {
    users.get_days(req.headers)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.post('/api/users/days', validateJWT, function (req, res) {
    users.add_days(req.headers)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

// ------------ SUBSCRIPTIONS ------------

router.get('/api/users/subscriptions', validateJWT, function (req, res) {
    subscriptions.get_subscription(req.headers)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.post('/api/users/subscriptions', validateJWT, function (req, res) {
    subscriptions.create_subscription(req.headers, req.body.type, req.body.state)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.put('/api/users/subscriptions/:subs_id', validateJWT, function (req, res) {
    subscriptions.update_subscription(req.headers, req.params.subs_id, req.body.type, req.body.state)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.delete('/api/users/subscriptions/:subs_id', validateJWT, function (req, res) {
    subscriptions.delete_subscription(req.headers, req.params.subs_id)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.get('/api/users/subscriptions/:subs_id/payments', validateJWT, function (req, res) {
    subscriptions.get_payments(req.headers, req.params.subs_id)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.post('/api/users/subscriptions/:subs_id/payments', validateJWT, function (req, res) {
    subscriptions.create_payment(req.headers, req.params.subs_id, req.body.extra)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.put('/api/users/subscriptions/:subs_id/payments/:pay_id', validateJWT, function (req, res) {
    subscriptions.update_payment(req.headers, req.params.subs_id, req.params.pay_id, req.body.extra)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.delete('/api/users/subscriptions/:subs_id/payments/:pay_id', validateJWT, function (req, res) {
    subscriptions.delete_payment(req.headers, req.params.subs_id, req.params.pay_id)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

// ------------ PROJECTS ------------

router.get('/api/users/projects', validateJWT, function (req, res) {
    projects.get_projects(req.headers)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.post('/api/users/projects', validateJWT, function (req, res) {
    projects.create_project(req.headers, req.body.name)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.put('/api/users/projects/:proj_id', validateJWT, function (req, res) {
    projects.update_project(req.headers, req.params.proj_id, req.body.name)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.delete('/api/users/projects/:proj_id', validateJWT, function (req, res) {
    projects.delete_project(req.headers, req.params.proj_id)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.post('/api/users/projects/:proj_id/images', validateJWT, function (req, res) {
    projects.upload_image(req.headers, req.params.proj_id, req.body.file)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.get('/api/users/projects/:proj_id/images', validateJWT, function (req, res) {
    projects.get_images(req.headers, req.params.proj_id)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.delete('/api/users/projects/:proj_id/images/:image_id', validateJWT, function (req, res) {
    projects.delete_image(req.headers, req.params.proj_id, req.params.image_id)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.get('/api/users/projects/:proj_id/tools', validateJWT, function (req, res) {
    projects.get_tools(req.headers, req.params.proj_id)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.post('/api/users/projects/:proj_id/tools', validateJWT, function (req, res) {
    projects.add_tool(req.headers, req.params.proj_id, req.body.position, req.body.procedure, req.body.parameters)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.put('/api/users/projects/:proj_id/tools/:tool_id', validateJWT, function (req, res) {
    projects.update_tool(req.headers, req.params.proj_id, req.params.tool_id, req.body.position, req.body.procedure, req.body.parameters)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.delete('/api/users/projects/:proj_id/tools/:tool_id', validateJWT, function (req, res) {
    projects.delete_tool(req.headers, req.params.proj_id, req.params.tool_id)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.post('/api/users/projects/:proj_id/process', validateJWT, function (req, res) {
    projects.trigger_process(req.headers, req.params.proj_id)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

router.get('/api/users/projects/:proj_id/status', validateJWT, function (req, res) {
    projects.process_status(req.headers, req.params.proj_id)
        .then(result => res.jsonp(result))
        .catch(err => handleError(res, err));
});

module.exports = router;
