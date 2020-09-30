const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    // gui token qua header
    const token = req.header('access-token')||req.body.token;
    if(!token) return res.redirect('/login');
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
         res.status(400).send('Invalid Token');
    }
}