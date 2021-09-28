const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.get('Authorization');

    // console.log("IN AUTH")
    // console.log(req)

    if (!token || token === '') {
        req.isAuth = false;
        // return next();
        throw Error("Authentication Failed")
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'SomeSuperSecretKey');
    } catch (err) {
        req.isAuth = false;
        // return next();
        throw Error("Authentication Failed")
    }

    if (!decodedToken) {
        req.isAuth = false;
        // return next();
        throw Error("Authentication Failed")
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};