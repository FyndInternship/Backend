const express = require('express');
const { postLogIn, postSignUp } = require('../Controllers/authController');
const { createTiffin, getAllTiffinWithProvider, getOneTiffinWithProvider, addItem, deleteTiffin } = require('../Controllers/tiffinController');
const { authHandlerMW } = require('../middlewares/authHandlerMW');
const { authHandlerTiffinMW } = require('../middlewares/authHandlerTiffinMW');

const router = express.Router();

router.post('/createTiffin', authHandlerMW, authHandlerTiffinMW, createTiffin)
router.get('/getAllTiffin', authHandlerMW, authHandlerTiffinMW, getAllTiffinWithProvider)
router.get('/getOneTiffin/:id', authHandlerMW, authHandlerTiffinMW, getOneTiffinWithProvider)
router.post('/addItem/:tiffinId', authHandlerMW, authHandlerTiffinMW, addItem)
router.delete('/deleteItem/:tiffinId', authHandlerMW, authHandlerTiffinMW, deleteTiffin)
module.exports = router;