const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const CustomErr = require('../utils/CustomErr');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "please enter email is a required field"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "please enter valid email"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: 8,
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, "please confirm your password"],
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: "password and confirm password don't match",
        },
    },
    pic: {
        type: String,
    },
    passwordChangedAt: Date,
    role: {
        type: String,
        enum: [ "admin", "student", "instructor"],
        default: "student",
    },
    bio:{
        type:String
    },
    active: {
        type: Boolean,
        default: false,
    },
    passwordResetToken: String,
    encryptedValidationNumber: String,
    passwordResetTokenExpire: Date,
    validationNumberExpiresAt: Date,
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined; // Remove confirm password
    next();
});

userSchema.pre('find', function (next) {
    this.where({ active: true }); // Only find active users
    next();
});

// Comparison and utility methods
userSchema.methods.comparePasswordInDb = async function (pswd, pswdDb) {
    return await bcrypt.compare(pswd, pswdDb);
};

userSchema.methods.isPasswordChanged = async function (JwtTimestamp) {
    if (this.passwordChangedAt) {
        const passwdChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JwtTimestamp < passwdChangedTimestamp;
    }
    return false;
};

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

userSchema.methods.generateAndEncryptValidationNumber = function () {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000).toString(); // Convert to string
    const cipher = crypto.createHash('sha256').update(randomNumber).digest('hex');
    this.active = false; // This line may not be necessary; consider removing it
    this.encryptedValidationNumber = cipher;
    this.validationNumberExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    return randomNumber; // Return the random number as a string
};

const User = mongoose.model('User', userSchema);
module.exports = User;
