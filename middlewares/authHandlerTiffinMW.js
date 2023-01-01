const authHandlerTiffinMW = async (req, res, next) => {
    try{
        if(!req.user) 
            return next({status: 402, message: "Authentication Error"})
        if(!req.user.isServiceProvider)
            return next({status: 500, message: "You are not authorised for this request"})

        next();
    } catch(err) {
        next(err);
    }
}

module.exports = {
    authHandlerTiffinMW
}