
module.exports = (req, res, next) => {
  if (req.user.isAdmin == 'true') {
    return next();
  }
  return res.status(401).send({ message: 'Admin Token is not valid.' });
};