const multer = require('multer')
const cloudinary = require('cloudinary')

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});



const upload_get_url = (image) => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(image , (err, url) => {
        if (err) return reject(err);
        return resolve(url);
      });
    });
}

const destinationFunction = (req, file, cb) => {
    cb(null, 'imageStorage')
}
const fileNameFunction = (req, file, cb) => {
    cb(null, new Date().toISOString() + '_' + file.originalname)
}

const fileFilter = (req, file, cb) => {
    const mimetype = file.mimetype
    if(mimetype === 'image/png' || mimetype === 'image/png' || mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        console.log(file)
        cb(null, false)
    }
}

const fileStorage = multer.diskStorage({
    destination: destinationFunction,
    filename: fileNameFunction,
    fileFilter: fileFilter
})

module.exports = {
    fileStorage,
    fileFilter,
    upload_get_url
}