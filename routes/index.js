const express = require('express')
const router = express.Router()
const authRouter = express.Router()
const {handleSendOtp,handleVerifyOtp, handleCartData , handleCartDataBulk,handleGetCartData,handleDeleteCartItem,handleIncrementCartItem,handleDecrementCartItem} = require('../controllers/index')



router.post('/' , handleCartData)
router.get('/' , handleGetCartData)
router.delete('/:userId/:itemId' , handleDeleteCartItem)
router.put('/increment/:userId/:itemId', handleIncrementCartItem); 
router.put('/decrement/:userId/:itemId', handleDecrementCartItem); 
router.post('/bulk' , handleCartDataBulk);

module.exports = router 