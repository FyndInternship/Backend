const mongoose = require('mongoose');
const User = require('../Database/models/user');
const { authenticationError } = require('./errorHandlerMw');
const authHandlerMW = async (req, res, next) => {
    try{
        console.log("hello")
        console.log(req.session.user)
        if(!req.session.user || !req.session.isLoggedIn)
        throw authenticationError()
        if(!req.headers['user-id'] || req.headers['is-service-provider'] === null)
        throw authenticationError()        
        if(req.session.user.isServiceProvider && req.headers['is-service-provider'] !== 'true')
        throw authenticationError()        
        if(!req.session.user.isServiceProvider && req.headers['is-service-provider'] !== 'false')
        throw authenticationError()        
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