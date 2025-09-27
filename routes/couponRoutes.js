const express = require('express');
const router = express.Router();
const {
    addNewCoupon,
    verifyCoupon,
    showAllCoupon
} = require('../controllers/couponController');

router.post('/addNewCoupon', addNewCoupon);
router.post('/verifyCoupon', verifyCoupon);
router.get('/showAllCoupon', showAllCoupon);

module.exports = router;