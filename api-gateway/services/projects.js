const axios = require('axios');
const { createHeaders } = require('../utils/utils.js');

module.exports.projectsAccessPoint = process.env.PROJECTS_AP || 'http://localhost:5000';
module.exports.projectsRoute = (route) => this.projectsAccessPoint + route


// ------------ PROJECTS MANAGEMENT --------------------------------

module.exports.get_projects = (reqHeaders) => {
    return axios.get(
        this.projectsRoute('/projects'),
        createHeaders(reqHeaders)
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: No projects found from user')
        }
    }).catch((err) => {
        throw err
    });
}

module.exports.create_project = (reqHeaders, name) => {
    return axios.post(
        this.projectsRoute('/projects'),
        { "name": name },
        createHeaders(reqHeaders)
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

module.exports.update_project = (reqHeaders, proj_id, name) => {
    return axios.put(
        this.projectsRoute('/projects/' + proj_id),
        { "name": name },
        createHeaders(reqHeaders)
    ).then((result) => {
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

module.exports.delete_project = (reqHeaders, proj_id) => {
    return axios.delete(
        this.projectsRoute('/projects/' + proj_id),
        createHeaders(reqHeaders)
    ).then((result) => {
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


// ------------ IMAGES MANAGEMENT --------------------------------


module.exports.upload_image = (reqHeaders, proj_id, image) => {
    return axios.post(
        this.projectsRoute('/projects/' + proj_id + '/images'),
        { "file": image },
        createHeaders(reqHeaders)
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid image -> ', image)
        }
    }).catch((err) => {
        throw err
    });
}

module.exports.get_images = (reqHeaders, proj_id) => {
    return axios.get(
        this.projectsRoute('/projects/' + proj_id + '/images'),
        createHeaders(reqHeaders)
    ).then((result) => {
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

module.exports.delete_image = (reqHeaders, proj_id, image_id) => {
    return axios.delete(
        this.projectsRoute('/projects/' + proj_id + '/images/' + image_id),
        createHeaders(reqHeaders)
    ).then((result) => {
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


// ------------ TOOLS MANAGEMENT --------------------------------


module.exports.get_tools = (reqHeaders, proj_id) => {
    return axios.get(
        this.projectsRoute('/projects/' + proj_id + '/tools'),
        createHeaders(reqHeaders)
    ).then((result) => {
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

module.exports.add_tool = (reqHeaders, proj_id, position, procedure, parameters) => {
    return axios.post(
        this.projectsRoute('/projects/' + proj_id + '/tools'),
        { "position": position, "procedure": procedure, "parameters": parameters },
        createHeaders(reqHeaders)
    ).then((result) => {
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

module.exports.update_tool = (reqHeaders, proj_id, tool_id, position, procedure, parameters) => {
    return axios.put(
        this.projectsRoute('/projects/' + proj_id + '/tools/' + tool_id),
        { "position": position, "procedure": procedure, "parameters": parameters },
        createHeaders(reqHeaders)
    ).then((result) => {
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

module.exports.delete_tool = (reqHeaders, proj_id, tool_id) => {
    return axios.delete(
        this.projectsRoute('/projects/' + proj_id + '/tools/' + tool_id),
        createHeaders(reqHeaders)
    ).then((result) => {
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


// ------------ PROCESS MANAGEMENT --------------------------------


module.exports.trigger_process = (reqHeaders, proj_id) => {
    return axios.post(
        this.projectsRoute('/projects/' + proj_id + '/process'),
        createHeaders(reqHeaders)
    ).then((result) => {
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

module.exports.process_status = (reqHeaders, proj_id) => {
    return axios.get(
        this.projectsRoute('/projects/' + proj_id + '/status'),
        createHeaders(reqHeaders)
    ).then((result) => {
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