const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    // gui token qua header
    const token = req.header('auth-token');
    // gui token qua cookie
    //const token = req.cookies.access_token;
    if(!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}