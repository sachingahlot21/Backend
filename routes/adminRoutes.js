const express = require('express');
const router = express.Router();
const {registerAdmin, loginAdmin, logoutAdmin, refreshAdmin} = require('../controllers/adminController')
const {adminAuth} = require('../middleware/adminAuth')

router.post("/register", registerAdmin );
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refresh", refreshAdmin);
router.use(adminAuth);

//one way to do
//sample - how to use adminAuth middleware
// router.get("/orders" , adminAuth , handleOrders  )

//2nd way to do
// router.use(adminAuth);
// router.get("/orders" , handleOrders  )
// router.get("/profiles", handleProfiles);


module.exports = router
