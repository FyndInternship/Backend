const User = require('../Database/models/user')
const TiffinServiceProvider = require('../Database/models/tiffin_service_provider')
const bcrypt = require('bcrypt');
const { hashValue } = require('../Utils/utils');


const postLogIn = async (req, res, next) => {
try {
    const body = req.body;
    if(body.email ==="" || body.password === "") throw new Error("Invalid Data provided")
    const user =  await User.findOne({email: body.email});
    if(!user) throw new Error("User Not found")
    bcrypt.compare(body.password, user.password, function(err, result) {
        if(err) {
            return next(err)
        }
        if(result === true) {            
            req.session.user = user
            req.session.isLoggedIn = true
            req.session.save(err => {
                throw err;
            })
            return res.status(200).send({
                data: user
            });
        } else {
            return next({
                status: 402,
                message: "Wrong Password"
              })
        }
    });
    } catch(err) {
        return next({
            status: 403,
            message: err.message
        })
    }
}

const postSignUp = async (req, res, next) => {
    try {
        const {email, password, name, contact_no, address, isServiceProvider} = req.body;

        if(isServiceProvider === ""  || email === "" || password === "" || name === "" || contact_no === "" || address.state === "" || address.city === "" || address.pincode === "") {
            throw new Error("Incomplete Credentials")
        }
        let user = null;
        if(isServiceProvider === true) {
            user = await TiffinServiceProvider.findOne({email});
        } else {
            user = await User.findOne({email});
        }
        
        if(user) {
            throw new Error("User Already Registered")
        }
        const hashedPassword = await hashValue(password);
        
        const constructed_address = {
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            street: address.street
        }
        const newUser = {
            email: email,
            password: hashedPassword,
            name: name,
            contact_no: contact_no,
            address: constructed_address
        };
        let finalUser = null;
        if(isServiceProvider === true) {
            finalUser = new TiffinServiceProvider(newUser);
        } else {
            finalUser = new User(newUser);
        }

        const result = await finalUser.save()
        return res.status(200).send({
            data: result
        })
        
    } catch(err) {
        next({
            message: err.message
        })
    }
}


module.exports = {
    postLogIn,
    postSignUp
}




