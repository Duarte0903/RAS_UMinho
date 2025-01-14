const axios = require('axios');

module.exports.subscriptionsAccessPoint = process.env.PROJECTS_AP || 'http://localhost:7002';
module.exports.subscriptionsRoute = (route) => this.subscriptionsAccessPoint + route


module.exports.get_subscription = (user_id) => {
    return axios.get(this.subscriptionsRoute('/subscriptions/' + user_id))
        .then((result) => {
            let resp = result.data
            if (resp != null) {
                return resp
            } else {
                throw new Error('Error: Invalid user -> ', user_id)
            }
        }).catch((err) => {
            throw err
        }); 
}

module.exports.update_subscription = (subs_id, type, state, inserted_at) => {
    let body = { "type": type, "state": state, "inserted_at": inserted_at };
    return axios.put(this.subscriptionsRoute('/subscriptions/' + subs_id), body)
        .then((result) => {
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

module.exports.delete_subscription = (subs_id) => {
    return axios.delete(this.subscriptionsRoute('/subscriptions/' + subs_id))
        .then((result) => {
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

module.exports.get_payments = (subs_id) => {
    return axios.get(this.subscriptionsRoute('/subscriptions/' + subs_id + '/payments'))
        .then((result) => {
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

module.exports.save_payment = (subs_id, extra) => {
    let body = { "extra": extra };
    return axios.post(this.subscriptionsRoute('/subscriptions/' + subs_id + '/payments'), body)
        .then((result) => {
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