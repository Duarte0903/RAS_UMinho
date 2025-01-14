const axios = require('axios');
const { createHeaders } = require('../utils/utils.js');

module.exports.subscriptionsAccessPoint = process.env.PROJECTS_AP || 'http://localhost:7002';
module.exports.subscriptionsRoute = (route) => this.subscriptionsAccessPoint + route


module.exports.get_subscription = (reqHeaders) => {
    return axios.get(
        this.subscriptionsRoute('/subscriptions'),
        createHeaders(reqHeaders)
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid user')
        }
    }).catch((err) => {
        throw err
    });
}

module.exports.create_subscription = (reqHeaders, type, state) => {
    return axios.post(
        this.subscriptionsRoute('/subscriptions'),
        { "type": type, "state": state },
        createHeaders(reqHeaders)
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid subscription -> ', subs_id)
        }
    }).catch((err) => {
        throw err
    });
}

module.exports.update_subscription = (reqHeaders, subs_id, type, state) => {
    return axios.put(
        this.subscriptionsRoute('/subscriptions/' + subs_id),
        { "type": type, "state": state },
        createHeaders(reqHeaders)
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid subscription -> ', subs_id)
        }
    }).catch((err) => {
        throw err
    });
}

module.exports.delete_subscription = (reqHeaders, subs_id) => {
    return axios.delete(
        this.subscriptionsRoute('/subscriptions/' + subs_id),
        createHeaders(reqHeaders)
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid subscription -> ', subs_id)
        }
    }).catch((err) => {
        throw err
    });
}


// ------------- PAYMENTS -----------------


module.exports.get_payments = (reqHeaders, subs_id) => {
    return axios.get(
        this.subscriptionsRoute('/subscriptions/' + subs_id + '/payments'),
        createHeaders(reqHeaders)
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid subscription -> ', subs_id)
        }
    }).catch((err) => {
        throw err
    });
}

module.exports.create_payment = (reqHeaders, subs_id, extra) => {
    return axios.post(
        this.subscriptionsRoute('/subscriptions/' + subs_id + '/payments'),
        { "extra": extra },
        createHeaders(reqHeaders)
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid subscription -> ', subs_id)
        }
    }).catch((err) => {
        throw err
    });
}

module.exports.update_payment = (reqHeaders, subs_id, pay_id, extra) => {
    return axios.put(
        this.subscriptionsRoute('/subscriptions/' + subs_id + '/payments/' + pay_id),
        { "extra": extra },
        createHeaders(reqHeaders)
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid subscription -> ', subs_id)
        }
    }).catch((err) => {
        throw err
    });
}

module.exports.delete_payment = (reqHeaders, subs_id, pay_id) => {
    return axios.put(
        this.subscriptionsRoute('/subscriptions/' + subs_id + '/payments/' + pay_id),
        createHeaders(reqHeaders)
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid subscription -> ', subs_id)
        }
    }).catch((err) => {
        throw err
    });
}