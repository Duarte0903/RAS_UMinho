const axios = require('axios');
const { createHeaders } = require('../utils/utils.js');

module.exports.projectsAccessPoint = process.env.PROJECTS_AP || 'http://localhost:5000';
module.exports.projectsRoute = (route) => this.projectsAccessPoint + route


// ------------ PROJECTS MANAGEMENT --------------------------------

module.exports.get_projects = (reqHeaders) => {
    return axios.get(
        this.projectsRoute('/projects'),
        createHeaders(reqHeaders)
    ).then(result => {
        let resp = result.data
        if (resp !== null) {
            return resp
        } else {
            throw new Error('Error: No projects found from user')
        }
    }).catch((err) => {
        throw err
    });
}

module.exports.get_project = (reqHeaders, proj_id) => {
    return axios
        .get(
            this.projectsRoute(`/projects/${proj_id}`), // Construct the route to the MS
            createHeaders(reqHeaders) // Pass headers including `Authorization`
        )
        .then(result => {
            let resp = result.data;
            if (resp != null) {
                return resp;
            } else {
                throw new Error(`Error: Project ${proj_id} not found`);
            }
        })
        .catch(err => {
            throw err;
        });
};

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

module.exports.delete_projects_user = (reqHeaders) => {
    return axios.delete(
        this.projectsRoute('/projects'),
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


// ------------ IMAGES MANAGEMENT --------------------------------


module.exports.upload_image = (reqHeaders, proj_id, formData) => {
    const { authorization, ...otherHeaders } = reqHeaders; // Extract only necessary headers

    return axios.post(
        `http://project-ms:5000/projects/${proj_id}/images`,
        formData,
        {
            headers: {
                Authorization: authorization, // Forward the Authorization header
                ...formData.getHeaders(), // Include FormData-specific headers
            },
        }
    )
    .then(response => response.data)
    .catch(err => {
        console.error('Error uploading image to microservice:', err.response?.data || err.message);
        throw new Error(`Failed to upload image: ${err.response?.data?.error || err.message}`);
    });
};

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

module.exports.serve_image = (bucket, filename) => {
    const imageUrl = this.projectsRoute(`/images/${bucket}/${filename}`); // Backend route to serve the image

    return axios
        .get(imageUrl, { responseType: 'stream' }) // Request the image as a stream
        .then((response) => {
            return response; // Return the response stream
        })
        .catch((err) => {
            throw new Error(
                `Failed to retrieve image: ${err.response?.data || err.message}`
            );
        });
};


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
    const headers = createHeaders(reqHeaders);
    return axios.post(
        this.projectsRoute('/projects/' + proj_id + '/process'),
        null, // No data for this POST request
        headers // Properly set headers
    ).then((result) => {
        let resp = result.data;
        if (resp != null) {
            return resp;
        } else {
            throw new Error('Error: Invalid project -> ', proj_id);
        }
    }).catch((err) => {
        console.error('Error triggering process:', {
            message: err.message,
            response: err.response?.data,
        });
        throw err;
    });
};

module.exports.process_status = (reqHeaders, proj_id, process_id) => {
    return axios.get(
        this.projectsRoute('/projects/' + proj_id + '/process/' + process_id),
        createHeaders(reqHeaders)
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid process -> ', process_id)
        }
    }).catch((err) => {
        throw err
    });
}

module.exports.cancel_process = (reqHeaders, proj_id, process_id) => {
    return axios.put(
        this.projectsRoute('/projects/' + proj_id + '/process/' + process_id),
        createHeaders(reqHeaders)
    ).then((result) => {
        let resp = result.data
        if (resp != null) {
            return resp
        } else {
            throw new Error('Error: Invalid process -> ', process_id)
        }
    }).catch((err) => {
        throw err
    });
}
