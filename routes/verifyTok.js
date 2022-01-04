const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHead = req.headers.token;
    if (authHead) {
        // since "Bearer" is being used, we split and take the token
        const token = authHead.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (error, user) => {
            if (error) {
                res.status(403).json("Invalid Token");
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You do not have the permissions to continue")
    }
}
// only admins are allowed update anything on the website
const verifyTokenAndAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not authorized to complete this action")
        }
    });
}
// only admins are allowed to update/add products to the website
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not authorized to complete this action")
        }
    });
}

module.exports = { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin };