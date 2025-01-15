const axios = require('axios');
const { createHeaders } = require('../utils/utils');

module.exports.usersAccessPoint = process.env.USERS_AP || 'http://localhost:5001';
module.exports.usersRoute = (route) => this.usersAccessPoint + route


module.exports.login_user = (email, password) => {
    return axios.post(
        this.usersRoute('/users/login'),
        { "email": email, "password": password }
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid email -> ', email)
        }
    }).catch((err) => {
        throw err
    });
}

module.exports.register_user = (name, email, password) => {
    return axios.post(
        this.usersRoute('/users/register'),
        { "name": name, "email": email, "password": password }
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid name -> ', name)
        }
    }).catch((err) => {
        throw err
    });
}

module.exports.update_user = (reqHeaders, name, email, password) => {
    return axios.put(
        this.usersRoute('/users'),
        { "name": name, "email": email, "password": password },
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

module.exports.delete_user = (reqHeaders) => {
    return axios.delete(
        this.usersRoute('/users'),
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

module.exports.get_todays_info = (reqHeaders) => {
    return axios.get(
        this.usersRoute('/users/days'),
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
