const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'user name is required!'],
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'user email address is required!'],
        unique: [true, 'user email is taken!'],
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
    active: {
        type: String,
        deafult: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;