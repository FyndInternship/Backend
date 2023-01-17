const mongoose = require('mongoose');
const User = require('../Database/models/user');
const { verifyJWT } = require('../Utils/jwt');
const { authenticationError } = require('./errorHandlerMw');
const authHandlerMW = async (req, res, next) => {
    try{

        console.log(req.headers['access-token'])
        const token = await verifyJWT(req.headers['access-token'])
        if(!token || !token.data || !token.data?.user)
        throw authenticationError()

        const {user, isLoggedIn} = token.data;

        if(!user || !isLoggedIn)
        throw authenticationError()
        if(!req.headers['user-id'] || typeof(JSON.parse(req.headers['is-service-provider'])) !=="boolean")
        throw authenticationError()        
        if(user.isServiceProvider != JSON.parse(req.headers['is-service-provider']))
        throw authenticationError()        
        if(user._id != req.headers['user-id'] )
        throw authenticationError()        

        //made a special check if user exist or not in db : todo
        
        
            // User.findOne({_id: user._id})       
        
        req.user = user
        next();
    } catch(err) {
        next(err);
    }
}

module.exports = {
    authHandlerMW
}