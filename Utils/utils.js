const bcrypt = require('bcrypt')
const hashValue = (value) => {
    console.log("sdfasd", value)
    return new Promise((resolve, reject) => {
        bcrypt.hash(value, 4, (err, hash) => {
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