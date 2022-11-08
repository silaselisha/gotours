const jwt = require('jsonwebtoken');

const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');
const User = require('../models/user-modle');

const jwtTokenGen = (id) => {
    const token = jwt.sign({id}, process.env.JWT_PRIVATE_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    return token;
}

const signUp = catchAsync(async (req, res, next) => {
    const {name, email, password, confirmPassword} = req.body;

    const newUser = await User.create({
        name,
        email,
        password,
        confirmPassword
    });

    const token = jwtTokenGen(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: newUser
    });
});

const login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
   
    if(!email || !password) {
        return next(new AppError('Provide both email and password', 400));
    }

    const user = await User.findOne({email: email}).populate('password');

    if(!user || !await user.validatePassword(password, user.password)) {
        return next(new AppError('Provide correct user email or password!', 400));
    }

    const token = jwtTokenGen(user._id);
    
    res.status(200).json({
        status: 'success',
        token
    });
});


const authenticate = {
    signUp,
    login
}

module.exports = authenticate;