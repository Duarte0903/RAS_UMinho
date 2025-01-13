const axios = require('axios');

module.exports.projectsAccessPoint = process.env.PROJECTS_AP || 'http://localhost:7003';
module.exports.projectsRoute = (route) => this.projectsAccessPoint + route


module.exports.get_projects = (user_id) => {
    return axios.get(this.projectsRoute('/projects/' + user_id))
        .then((result) => {
            let resp = result.data
            if (resp != null) {
                return resp
            } else {
                throw new Error('Error: No projects found from user -> ', user_id)
            }
        }).catch((err) => {
            throw err
        }); 
}

module.exports.create_project = (user_id, name) => {
    return axios.post(this.projectsRoute('/projects'), { "user_id": user_id, "name": name })
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

module.exports.update_project = (proj_id, name) => {
    return axios.put(this.projectsRoute('/projects/' + proj_id), { "name": name })
        .then((result) => {
            let resp = result.data
            if (resp != null) {
                return resp
            } else {
                throw new Error('Error: No projects found from user -> ', user_id)
            }
        }).catch((err) => {
            throw err
        }); 
}

module.exports.delete_project = (proj_id) => {
    return axios.delete(this.projectsRoute('/projects/' + proj_id))
        .then((result) => {
            let resp = result.data
            if (resp != null) {
                return resp
            } else {
                throw new Error('Error: Invalid project -> ', proj_id)
            }
        }).catch((err) => {
            throw err
        }); 
}

module.exports.upload_images = (proj_id, images) => {
    return axios.post(this.projectsRoute('/projects/' + proj_id + '/images'), { "images": images })
        .then((result) => {
            let resp = result.data
            if (resp != null) {
                return resp
            } else {
                throw new Error('Error: Invalid image(s) -> ', images)
            }
        }).catch((err) => {
            throw err
        }); 
}

module.exports.get_images = (proj_id) => {
    return axios.get(this.projectsRoute('/projects/' + proj_id + '/images'))
        .then((result) => {
            let resp = result.data
            if (resp != null) {
                return resp
            } else {
                throw new Error('Error: Invalid project -> ', proj_id)
            }
        }).catch((err) => {
            throw err
        }); 
}

module.exports.delete_image = (proj_id, image_id) => {
    return axios.delete(this.projectsRoute('/projects/' + proj_id + '/images/' + image_id))
        .then((result) => {
            let resp = result.data
            if (resp != null) {
                return resp
            } else {
                throw new Error('Error: Invalid project -> ', proj_id)
            }
        }).catch((err) => {
            throw err
        }); 
}

module.exports.add_tools = (proj_id, tools) => {
    return axios.post(this.projectsRoute('/projects/' + proj_id + '/tools'), { "tools": tools })
        .then((result) => {
            let resp = result.data
            if (resp != null) {
                return resp
            } else {
                throw new Error('Error: Invalid tool(s) -> ', tools)
            }
        }).catch((err) => {
            throw err
        }); 
}

module.exports.update_tool = (proj_id, tool_id, position, procedure, parameters) => {
    return axios.put(this.projectsRoute('/projects/' + proj_id + '/tools/' + tool_id),
        { "position": position, "procedure": procedure, "parameters": parameters })
            .then((result) => {
                let resp = result.data
                if (resp != null) {
                    return resp
                } else {
                    throw new Error('Error: Invalid tool -> ', tool_id)
                }
            }).catch((err) => {
                throw err
            }); 
}

module.exports.delete_tool = (proj_id, tool_id) => {
    return axios.delete(this.projectsRoute('/projects/' + proj_id + '/tools/' + tool_id))
        .then((result) => {
            let resp = result.data
            if (resp != null) {
                return resp
            } else {
                throw new Error('Error: Invalid tool -> ', tool_id)
            }
        }).catch((err) => {
            throw err
        }); 
}

module.exports.trigger_process = (proj_id) => {
    return axios.post(this.projectsRoute('/projects/' + proj_id + '/process'))
        .then((result) => {
            let resp = result.data
            if (resp != null) {
                return resp
            } else {
                throw new Error('Error: Invalid project -> ', proj_id)
            }
        }).catch((err) => {
            throw err
        }); 
}

module.exports.process_status = (proj_id) => {
    return axios.get(this.projectsRoute('/projects/' + proj_id + '/status'))
        .then((result) => {
            let resp = result.data
            if (resp != null) {
                return resp
            } else {
                throw new Error('Error: Invalid project -> ', proj_id)
            }
        }).catch((err) => {
            throw err
        }); 
}