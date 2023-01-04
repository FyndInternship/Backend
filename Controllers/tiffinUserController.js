const User = require('../Database/models/user')
const TiffinServiceProvider = require('../Database/models/tiffin_service_provider')
const Tiffin = require('../Database/models/tiffin')


const getAllTiffinsOnLocation = async (req, res, next) => {
    try {
        console.log(req.query)
        const address = req.query
        if(!req.user || req.user.isServiceProvider)
            return next({status: 402, message: "Authentication Error, Please login as a tiffin provider"})
        const addFilter = {};
        if(address?.city)
            addFilter['address.city'] = address.city;
        if(address?.state)
            addFilter['address.state'] = address.state;
        if(address?.pincode) 
            addFilter['address.pincode'] = address.pincode;
        // console.log(address, addFilter)
        const tiffins = await Tiffin.find(addFilter).populate('userId');
        return res.status(200).json({data: tiffins});
    } catch(err) {
        next(err);
    }
}

const bookCall = async (req, res, next) => {
    try {
        const tiffinId = req.params.tiffinId
        if(!req.user || req.user.isServiceProvider)
        return next({status: 402, message: "Authentication Error, Please login as a tiffin provider"})
        const tiffin = await Tiffin.findOneAndUpdate({_id: tiffinId, requests: {$nin: [req.user._id]}}, {"$push": {"requests": req.user._id}}, {new: true});
        res.status(200).json(tiffin)
    } catch(err) {
        next(err)
    }
}




module.exports = {
    getAllTiffinsOnLocation,
    bookCall,
}