const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'user name is required!'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'user email address is required!'],
        unique: [true, 'user email is taken!'],
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'provide a valid email address']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'guide', 'admin', 'lead-guide'],
            message: '{VALUE} is an invalid role!'
        },
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'user password is required!'],
        minLength: 8,
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'confirm your password please!'],
        validate: {
            validator: function() {
                return this.confirmPassword === this.password
            },
            message: 'The passwords do not match!'
        },
    },
    photo: String,
    active: {
        type: String,
        deafult: true
    },
    passwordChangedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now(),
    }
}, {
    toJSON: {virtuals: true},
    toObject: { virtuals: true}
});

/**
 * @Encrypt passwords
 * @Instance methods
 */
UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

UserSchema.methods.validatePassword = async function (passwordToTest, encryptedPassword) {
    return await bcrypt.compare(passwordToTest, encryptedPassword);
}

UserSchema.methods.checkForUpdatedPasswords = function(jwt_timestamp) {
    const timeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return timeStamp > jwt_timestamp ? true : false;
}
const User = mongoose.model('User', UserSchema);

module.exports = User;