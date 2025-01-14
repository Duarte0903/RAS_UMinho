// Helper para criar headers com o token
module.exports.createHeaders = (reqHeaders) => {
    const authHeader = reqHeaders['authorization'];
    if (!authHeader) {
        throw new Error('Authorization token not provided');
    }
    return {
        headers: {
            Authorization: authHeader
        }
    };
};