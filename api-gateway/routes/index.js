const express = require('express');
const router = express.Router();
const { validateJWT } = require('../authentication/authentication');
const multer = require('multer');
const upload = multer(); // For in-memory storage; configure storage as needed
const logger = require('./logger'); // Import the logger
const users = require('../services/users');
const subscriptions = require('../services/subscriptions');
const projects = require('../services/projects');
const FormData = require('form-data'); // Required for creating FormData in Node.js

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

router.get('/api/users/projects/:proj_id', validateJWT, function (req, res) {
    projects.get_project(req.headers, req.params.proj_id) 
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

router.post(
    '/api/users/projects/:proj_id/images',
    validateJWT,
    upload.single('file'), // Ensure the frontend uses 'file' as the FormData key
    function (req, res) {
        if (!req.file) {
            logger.error('No file provided in the request', {
                route: '/api/users/projects/:proj_id/images',
                headers: req.headers,
                params: req.params,
            });
            return res.status(400).json({ error: "No file provided" });
        }

        logger.info('Received file', {
            fileName: req.file.originalname        });

        // Prepare FormData to send to the backend
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        // Forward the file to the backend
        projects.upload_image(req.headers, req.params.proj_id, formData)
            .then(result => {
                logger.info('File uploaded successfully', {
                    projectId: req.params.proj_id,
                    result,
                });
                res.jsonp(result);
            })
            .catch(err => {
                logger.error('Error uploading file', {
                    error: err.message,
                    stack: err.stack,
                });
                handleError(res, err);
            });
    }
);

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

router.get('/api/images/:bucket/:filename', function (req, res) {
    projects.serve_image(req.params.bucket, req.params.filename)
        .then(response => {
            // Pipe the response directly to the client
            response.data.pipe(res);
        })
        .catch(err => {
            logger.error('Error retrieving image', {
                bucket,
                filename,
                error: err.message,
                stack: err.stack,
            });
            handleError(res, err);
        });
});


module.exports = router;
