const bcrypt = require('bcrypt');

const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');
const User = require('../models/user-modle');


const signUp = catchAsync(async (req, res, next) => {
    const {name, email, password, confirmPassword} = req.body;

    const newUser = await User.create({
        name,
        email,
        password,
        confirmPassword
    });

    res.status(201).json({
        status: 'success',
        data: newUser
    });
});

const login = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
    });
});


const authenticate = {
    signUp,
    login
};

module.exports = authenticate;