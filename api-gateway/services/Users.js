const axios = require('axios');

module.exports.usersAccessPoint = process.env.USERS_AP || 'http://localhost:7001';
module.exports.usersRoute = (route) => this.usersAccessPoint + route


module.exports.register = (name, email, password) => {
    return axios.post(this.usersRoute('/users/register'),  { "name": name, "email": email, "password": password })
        .then((result) => {
            let resp = result.data
            if (resp != null) {
                console.log("User registered successfully")
                return resp
            } else {
                throw new Error('Error: InvalidUsername -> ', name)
            }
        }).catch((err) => {
            console.log("Error registering")
            throw err
        }); 
}