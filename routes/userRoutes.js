const express = require('express');
const { postLogIn, postSignUp } = require('../Controllers/authController');
const { createTiffin, getAllTiffinWithProvider, getOneTiffinWithProvider } = require('../Controllers/tiffinController');
const { getAllTiffinsOnLocation, bookCall } = require('../Controllers/tiffinUserController');
const { authHandlerMW } = require('../middlewares/authHandlerMW');
const { authHandlerTiffinMW } = require('../middlewares/authHandlerTiffinMW');

const router = express.Router();

router.get('/getAllTiffin', authHandlerMW, getAllTiffinsOnLocation )
router.post('/requestCall/:tiffinId', authHandlerMW, bookCall )



module.exports = router;