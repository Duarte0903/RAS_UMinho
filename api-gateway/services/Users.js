const axios = require('axios');

module.exports.usersAccessPoint = process.env.USERS_AP || 'http://localhost:7001';
module.exports.usersRoute = (route) => this.usersAccessPoint + route


module.exports.get_user_by_name = (name) => {
    return axios.get(this.usersRoute('/users/name/' + name))
        .then((result) => {
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

module.exports.get_user_by_email = (email) => {
    return axios.get(this.usersRoute('/users/email/' + email))
        .then((result) => {
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
    let body = { "name": name, "email": email, "password": password };
    return axios.post(this.usersRoute('/users/register'),  body)
        .then((result) => {
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

module.exports.update_user = (user_id, name, email, password) => {
    let body = { "name": name, "email": email, "password": password };
    return axios.put(this.usersRoute('/users/' + user_id), body)
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

module.exports.delete_user = (user_id) => {
    return axios.delete(this.usersRoute('/users/' + user_id))
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

module.exports.get_todays_info = (user_id) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    return axios.get(this.usersRoute('/users/' + user_id + '/days/' + formattedDate))
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