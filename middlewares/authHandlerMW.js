const mongoose = require('mongoose');
const User = require('../Database/models/user');
const { authenticationError } = require('./errorHandlerMw');
const authHandlerMW = async (req, res, next) => {
    try{
        // console.log(req.session.user)
        // console.log(typeof(req.session.isLoggedIn))
        console.log()
        if(!req.session.user || !req.session.isLoggedIn)
        throw authenticationError()
        if(!req.headers['user-id'] || typeof(JSON.parse(req.headers['is-service-provider'])) !=="boolean")
        throw authenticationError()        
        if(req.session.user.isServiceProvider != JSON.parse(req.headers['is-service-provider']))
        throw authenticationError()        
        if(req.session.user._id != req.headers['user-id'] )
        throw authenticationError()        

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