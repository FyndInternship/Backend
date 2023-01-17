let jwt = require('jsonwebtoken');

const signJWT = (data) => {
    return new Promise((resolve, reject) => {
        jwt.sign({
            data
        }, "arya", (err, token) => {
            if(err)
            reject(err)
            else 
            {
                console.log(token)
                resolve(token)
            }
        })
    })
}


const verifyJWT = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token
        , "arya", (err, decoded) => {
            if(err)
            resolve(null)
            else 
            {
                console.log(decoded)
                resolve(decoded)
            }
        })
    })
}

module.exports = {
    signJWT,
    verifyJWT
}