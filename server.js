const express=require("express")
const app=express()
const user=require("./routes/user.js")
const {connectDB}=require('./db.js')
const bodyParser = require("body-parser")

const frgtpass=require('./routes/frgtp.js')
//Middlewares

app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended:false}))


//connection
connectDB()

// Twilio configuration


// Route to initiate password reset via OTP

//routes
app.use('/user',user);
app.use('/reset-pass',frgtpass)
app.listen(8005,()=>{console.log("Server Started at prot 8005")})