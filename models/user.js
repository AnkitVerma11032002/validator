const mongoose = require('mongoose');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                const phoneNumber = parsePhoneNumberFromString(v);
                return phoneNumber && phoneNumber.isValid();
            },
            message: props => `${props.value} is not a valid mobile number!`,
        },
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
