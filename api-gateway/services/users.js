const axios = require('axios');
const { createHeaders } = require('../utils/utils');

module.exports.usersAccessPoint = process.env.USERS_AP || 'http://localhost:5001';
module.exports.usersRoute = (route) => this.usersAccessPoint + route


module.exports.get_user_details = (reqHeaders) => {
    return axios.get(
        this.usersRoute('/users'),
        createHeaders(reqHeaders)
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid token')
        }
    }).catch((err) => {
        throw err
    });
}

module.exports.login_user = (email, password) => {
    return axios.post(
        this.usersRoute('/users/authenticate'),
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

module.exports.login_anonimo = () => {
    return axios.post(
        this.usersRoute('/users/authenticate/anonimo')
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Something went wrong')
        }
    }).catch((err) => {
        throw err
    });
}

module.exports.register_user = (name, email, password) => {
    return axios.post(
        this.usersRoute('/users'),
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

module.exports.update_user = (reqHeaders, name, email, oldPassword, newPassword) => {
    return axios.put(
        this.usersRoute('/users'),
        { "name": name, "email": email, "oldPassword": oldPassword, "newPassword": newPassword },
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

module.exports.update_user_type = (reqHeaders, type) => {
    return axios.put(
        this.usersRoute('/users/type'),
        { "type": type },
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


// ----------- DAYS -------------


module.exports.get_todays_record = (reqHeaders) => {
    return axios.get(
        this.usersRoute('/days'),
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

module.exports.increment_todays_record = (reqHeaders) => {
    return axios.post(
        this.usersRoute('/days'),
        createHeaders(reqHeaders)
    ).then((result) => {
        let resp = result.data
        console.log("increment: ", resp)
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid user')
        }
    }).catch((err) => {
        throw err
    });
}
