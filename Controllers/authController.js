const User = require('../Database/models/user')
const TiffinServiceProvider = require('../Database/models/tiffin_service_provider')
const bcrypt = require('bcrypt');
const { hashValue } = require('../Utils/utils');
const { boolean } = require('webidl-conversions');
const { signJWT } = require('../Utils/jwt');


const postLogIn = async (req, res, next) => {
try {
    const body = req.body;
    if(body.email ==="" || body.password === "" || typeof(body.isServiceProvider) !== "boolean") throw new Error("Invalid Data provided")
    let user;
    if(body.isServiceProvider === true)
     user =  await TiffinServiceProvider.findOne({email: body.email});
    else 
    user =  await User.findOne({email: body.email});
    if(!user) throw new Error("User Not found")
    bcrypt.compare(body.password, user.password, async function(err, result) {
        if(err) {
            return next(err)
        }
        if(result === true) {  
            const obj = {
                'user': user,
                'isLoggedIn': true
            }      
            const token = await signJWT(obj);    
            req.session.user = user
            req.session.isLoggedIn = true
            req.session.save(err => {
                if(err)
                throw new Error(err);
            })
            return res.status(200).send({
                data: user,
                token,
            });
        } else {
            throw new Error("Wrong Password")
        }
    });
    } catch(err) {
        return next(err)
    }
}

const logOut = async (req, res, next) => {
    try {
        req.session.destroy();
        res.status(200).send();
    }catch(err) {
        next(err)
    }
}

const postSignUp = async (req, res, next) => {
    try {
        const {email, password, name, contact_no, address, isServiceProvider} = req.body;
        if(typeof(isServiceProvider) !== "boolean"  || email === "" || password === "" || name === "" || contact_no === "" || address.state === "" || address.city === "" || address.pincode === "") {
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
        next(err)
    }
}


module.exports = {
    postLogIn,
    postSignUp,
    logOut
}





