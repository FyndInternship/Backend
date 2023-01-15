const express = require('express');
const { postLogIn, postSignUp, logOut } = require('../Controllers/authController');
const { authHandlerMW } = require('../middlewares/authHandlerMW');

const router = express.Router();


router.post('/signin', postLogIn)
router.post('/signup', postSignUp)
router.post('/signout', logOut)



module.exports = router;