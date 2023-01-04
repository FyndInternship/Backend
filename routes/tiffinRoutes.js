const express = require('express');
const { postLogIn, postSignUp } = require('../Controllers/authController');
const { createTiffin, getAllTiffinWithProvider, getOneTiffinWithProvider, addItem } = require('../Controllers/tiffinController');
const { authHandlerMW } = require('../middlewares/authHandlerMW');
const { authHandlerTiffinMW } = require('../middlewares/authHandlerTiffinMW');

const router = express.Router();

router.post('/createTiffin', authHandlerMW, authHandlerTiffinMW, createTiffin)
router.get('/getAllTiffin', authHandlerMW, authHandlerTiffinMW, getAllTiffinWithProvider)
router.get('/getOneTiffin/:id', authHandlerMW, authHandlerTiffinMW, getOneTiffinWithProvider)
router.post('/addItem/:tiffinId', authHandlerMW, authHandlerTiffinMW, addItem)

module.exports = router;