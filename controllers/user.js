const User = require('../models/user');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const axios = require('axios'); // Import Axios for making HTTP requests

const infobipApiKey = '3740f5232143dbd9f61341c37bde2144-1839daf2-d5e9-4204-a2c0-6c042d5abc26'; // Replace 'your-infobip-api-key' with your actual API key

const { parsePhoneNumberFromString } = require('libphonenumber-js');

const otps={};

async function handleSignupUser(req, res) {
    const { name, email, password, mobileNumber } = req.body;
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'User already registered' });
    }

    // Validate password
    if (password.length < 7) {
        return res.status(400).json({ error: 'Password should be at least 7 characters long' });
    }
    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ error: 'Password should contain at least one uppercase letter' });
    }
    if (!/[a-z]/.test(password)) {
        return res.status(400).json({ error: 'Password should contain at least one lowercase letter' });
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
        return res.status(400).json({ error: 'Password should contain at least one special character' });
    }

    // Validate and format mobile number
    const phoneNumber = parsePhoneNumberFromString(mobileNumber);
    if (!phoneNumber || !phoneNumber.isValid()) {
        return res.status(400).json({ error: 'Invalid mobile number format' });
    }
    const formattedNumber = phoneNumber.number; // E.164 format

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    try {
        await User.create({ name, email, password: hashedPassword, mobileNumber: formattedNumber });
        res.json({ message: 'User signed up successfully' });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}




async function handleResetPassword(req, res) {
    const { mobileNumber } = req.body;

    // Validate and format mobile number
    const phoneNumber = parsePhoneNumberFromString(mobileNumber);
    if (!phoneNumber || !phoneNumber.isValid()) {
        return res.status(400).json({ error: 'Invalid mobile number format' });
    }
    const formattedNumber = phoneNumber.number; // E.164 format

    // Check if the mobile number exists in the database
    const user = await User.findOne({ mobileNumber: formattedNumber });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

    // Store OTP in memory with mobile number as key
    otps[formattedNumber] = otp;

    // Send OTP via SMS using Infobip API
    try {
        const response = await axios.post('https://api.infobip.com/sms/1/text/single', {
            from: 'YourSenderID',
            to: formattedNumber,
            text: `Your OTP for password reset is: ${otp}`
        }, {
            headers: {
                'Authorization': `App ${infobipApiKey}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            res.status(200).json({ message: `OTP sent successfully and your otp is ${otp}` });
        } else {
            console.error('Error sending OTP:', response.data);
            res.status(500).json({ error: 'Failed to send OTP' });
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
}



async function handleLoginUser(req, res) {
    // Implement login functionality here
}

module.exports = {
    handleSignupUser,
    handleLoginUser,
    handleResetPassword
};
