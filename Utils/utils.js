const bcrypt = require('bcrypt')
const hashValue = (value) => {
    console.log("sdfasd", value)
    return new Promise((resolve, reject) => {
        bcrypt.hash(value, process.env.BCRYPT_SALT_ROUND, (err, hash) => {
            if(err) {
                reject(err);
            } else{
                resolve(hash)
            }
        })
    })
}
module.exports = {
    hashValue
}