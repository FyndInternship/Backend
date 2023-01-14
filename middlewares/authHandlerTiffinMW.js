const { authenticationError } = require("./errorHandlerMw");

const authHandlerTiffinMW = async (req, res, next) => {
    try{
        if(!req.user) 
        throw authenticationError()
        if(!req.user.isServiceProvider)
        throw authenticationError()
        next();
    } catch(err) {
        next(err);
    }
}

module.exports = {
    authHandlerTiffinMW
}