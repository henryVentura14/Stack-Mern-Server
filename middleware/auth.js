const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Leer el token del header
    const token = req.header('x-auth-token');

    // Revisar si no hay token
    if(!token) {
        return res.status(401).json({msg: 'No Token, invalid permission'})
    }

    // validar el token

    try {
        const encryption = jwt.verify(token, process.env.SECRET_WORD);
        req.user = encryption.user;
        next();
    } catch (error) {
        res.status(401).json({msg: 'Invalid token'});
    }
}