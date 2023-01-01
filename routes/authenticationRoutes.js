const express = require('express');
const { postLogIn, postSignUp } = require('../Controllers/authController');

const router = express.Router();


router.post('/signin', postLogIn)
router.post('/signup', postSignUp)



module.exports = router;