const User = require('../Database/models/user')
const TiffinServiceProvider = require('../Database/models/tiffin_service_provider')
const Tiffin = require('../Database/models/tiffin')


const createTiffin = async (req, res, next) => {
try {
    console.log(req.user)
    if(!req.user) 
    return next({status: 402, message: "Authentication error"})
    const {name, address} = req.body;
    if(!name || !address.city || !address.state || !address.pincode) throw new Error("Incomplete data")

    const constructed_address = {
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        street: address.street || ""
    }

    const newTiffin = new Tiffin({
        name: name,
        address: constructed_address,
        userId: req.user._id        
    });
    const result = await newTiffin.save();
    return res.status(200).json({data: result})
} catch(err) {
    next(err);
}
}

const getAllTiffinWithProvider = async (req, res, next) => {
    try {
        if(!req.user || !req.user.isServiceProvider)
            return next({state: 402, message: "authentication error"})
        
        const allTiffins = await Tiffin.find({userId: req.user._id});
        return res.status(200).json({data: allTiffins});
    } catch(err) {
        next(err);
    }
}


const getOneTiffinWithProvider = async (req, res, next) => {
    try {
        if(!req.user || !req.user.isServiceProvider)
            return next({state: 402, message: "authentication error"})
        if(!req.params.id)
            throw new Error("Tiffin id must be provided")
            console.log("dsf", req.params)
        const idToFind = req.params.id
        const allTiffins = await Tiffin.findOne({$and: [{userId: req.user._id}, {_id: idToFind}]});
        return res.status(200).json({data: allTiffins});
    } catch(err) {
        next(err);
    }
}

module.exports = {
    createTiffin,
    getAllTiffinWithProvider,
    getOneTiffinWithProvider
}
