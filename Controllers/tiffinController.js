const User = require('../Database/models/user')
const TiffinServiceProvider = require('../Database/models/tiffin_service_provider')
const Tiffin = require('../Database/models/tiffin')
const { upload_get_url } = require('../Utils/fileUpload')
const { authenticationError } = require('../middlewares/errorHandlerMw')


const createTiffin = async (req, res, next) => {
try {
    if(!req.user) 
    throw authenticationError()
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
    const user = await TiffinServiceProvider.findByIdAndUpdate(req.user._id, {"$push": {"tiffins": result._id}}, {new: true})
    return res.status(200).json({data: result})
} catch(err) {
    next(err);
}
}

const getAllTiffinWithProvider = async (req, res, next) => {
    try {
        if(!req.user || !req.user.isServiceProvider)
        throw authenticationError()
        
        const allTiffins = await Tiffin.find({userId: req.user._id}).populate('requests');
        return res.status(200).json({data: allTiffins});
    } catch(err) {
        next(err);
    }
}


const getOneTiffinWithProvider = async (req, res, next) => {
    try {
        if(!req.user || !req.user.isServiceProvider)
        throw authenticationError()

        if(!req.params.id)
            throw new Error("Tiffin id must be provided")
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
        console.log(typeof(tiffinId))
        console.log(tiffinId == "null")
        if(tiffinId === "null")
        throw new Error("Tiffin Id must be present")
        if(!req.user) throw authenticationError();
        const image = req.file
        if(!image)
        throw new Error("Problem in uploading file")
        if(!req.body.name)
        throw new Error("food name is must")
        const {public_id, secure_url} = await upload_get_url(image.path);
        const tif = await Tiffin.findOne({_id: tiffinId, "menu.name": req.body.name})
        if(tif) throw new Error("Food already exist")
        const final_tif = await Tiffin.findByIdAndUpdate(tiffinId,  {"$push": {"menu": {"name": req.body.name, publicId: public_id, imageUrl: secure_url}}}, {new: true})
        res.status(200).send({data: final_tif})
    } catch(err) {
        next(err)
    }
}

const deleteTiffin = async (req, res, next) => {
    try {
        const {tiffinId} = req.params
        if(!tiffinId) 
            throw new Error("Tiffin Id is mandatory")
        if(!req.user)
            throw authenticationError()
        await Tiffin.deleteOne({_id: tiffinId, userId: req.user._id})
        const tiffinServer = await TiffinServiceProvider.updateOne({_id: req.user._id}, {
            $pull: {"tiffins" : tiffinId}
        }, {new: true})
        console.log(tiffinServer)
        res.status(200).send(tiffinServer)
    } catch(err) {
        next(err)
    }
}

module.exports = {
    createTiffin,
    getAllTiffinWithProvider,
    getOneTiffinWithProvider,
    addItem,
    deleteTiffin
}
