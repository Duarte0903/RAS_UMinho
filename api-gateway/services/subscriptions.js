const axios = require('axios');

module.exports.subscriptionsAccessPoint = process.env.PROJECTS_AP || 'http://localhost:7002';
module.exports.subscriptionsRoute = (route) => this.subscriptionsAccessPoint + route


