const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) return res.status(401).send();
        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token, process.env.SECRET)
        req.idUser = payload.userId;
        next();
    } catch (error) {
        return res.status(401).send();
    }
}

module.exports = auth;