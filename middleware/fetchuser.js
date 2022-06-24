const jwt = require('jsonwebtoken');
const secret = "sagar";

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({error: "user not authorized"});
    }
    try {
    const user = jwt.verify(token, secret);
    req.body = {req: req.body, id: user.user.id}
    next();
    } catch (error) {
        res.status(401).send({error: "user not authorized"});
    }
}

module.exports = fetchUser;