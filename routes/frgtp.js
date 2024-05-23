const express=require('express')
const {handleResetPassword}=require("../controllers/user")
const router=express.Router();

router.post('/otp',handleResetPassword)

module.exports=router