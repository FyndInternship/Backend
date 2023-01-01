const mongoose = require('mongoose');
const User = require('../Database/models/user');
const authHandlerMW = async (req, res, next) => {
    try{
        console.log(req.session.user)
        if(!req.session.user || !req.session.isLoggedIn)
            return next({status: 402, message: "Authentication Error In auth"});
        console.log(req.headers)
        if(!req.headers['user-id'] || req.headers['is-service-provider'] === null) 
            return next({status: 402, message: "Authentication Error in auth 2"}); 

        console.log(req.session.user._id == req.headers['user-id'])    

        console.log(req.headers['user-id'])

        if(req.session.user.isServiceProvider && req.headers['is-service-provider'] !== 'true')
        return next({status: 402, message: "Authentication Error auth 3"}); 

        if(!req.session.user.isServiceProvider && req.headers['is-service-provider'] !== 'false')
        return next({status: 402, message: "Authentication Error auth 3"}); 
        if(req.session.user._id != req.headers['user-id'] )
        return next({status: 402, message: "Authentication Error auth 3"}); 
        //made a special check if user exist or not in db : todo
        
        
            // User.findOne({_id: req.session.user._id})       
        
        req.user = req.session.user
        next();
    } catch(err) {
        next(err);
    }
}

module.exports = {
    authHandlerMW
}