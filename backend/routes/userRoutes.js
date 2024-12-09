const express = require('express')
const { registerUser, authUser, allUsers, forgetPassword, resetPassword }  = require("../controllers/userControllers")
const protect = require('../middlewares/authMiddleware')

const router = express.Router()


router.route('/').post(registerUser).get(protect,allUsers)

router.post('/login', authUser)
router.post('/forget-password',forgetPassword)
router.post('/reset-password/:token',resetPassword)

module.exports = router