const User = require('../Database/models/user')
const TiffinServiceProvider = require('../Database/models/tiffin_service_provider')
const Tiffin = require('../Database/models/tiffin')
const { upload_get_url } = require('../Utils/fileUpload')


const createTiffin = async (req, res, next) => {
try {
    console.log(req.user)
    if(!req.user) 
    return next({status: 402, message: "Authentication error"})
    const {name, address} = req.body;
    // console.log(JSON.parse(req.body))
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
    const user = await TiffinServiceProvider.findByIdAndUpdate(req.user._id, {"$push": {"tiffins": result._id}}, {new: true})
    console.log(user);
    return res.status(200).json({data: result})
} catch(err) {
    next(err);
}
}

const getAllTiffinWithProvider = async (req, res, next) => {
    try {
        if(!req.user || !req.user.isServiceProvider)
            return next({state: 402, message: "authentication error"})
        
        const allTiffins = await Tiffin.find({userId: req.user._id}).populate('requests');
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

const addItem = async (req, res, next) => {
    try {
        const {tiffinId} = req.params

        if(!req.user)
        next({status: 402, message: "Authentication error"});
        
        const image = req.file
        if(!image)
        throw new Error("Problem in uploading file")
        if(!req.body.name)
        throw new Error("food name is must")
        const {public_id, secure_url} = await upload_get_url(image.path);
        console.log('cloudata', secure_url, public_id);
        const tif = await Tiffin.findOne({_id: tiffinId, "menu.name": req.body.name})
        if(tif) throw new Error("Food already exist")
        const final_tif = await Tiffin.findByIdAndUpdate(tiffinId,  {"$push": {"menu": {"name": req.body.name, publicId: public_id, imageUrl: secure_url}}}, {new: true})
        res.status(200).send({data: final_tif})
    } catch(err) {
        next(err)
    }
}

module.exports = {
    createTiffin,
    getAllTiffinWithProvider,
    getOneTiffinWithProvider,
    addItem
}
