const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');
const User = require('../models/user-modle');
const jwtTokenGen = require('../utils/jwt-gen');
const sendToken = require('../utils/send-token');

const signUp = catchAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    const newUser = await User.create({
        name,
        email,
        password,
        confirmPassword
    });

    sendToken(201, newUser, res)
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Provide both email and password', 400));
    }

    const user = await User.findOne({ email: email }).populate('password');

    if (!user || !await user.validatePassword(password, user.password)) {
        return next(new AppError('Provide correct user email or password!', 400));
    }

    sendToken(200, user, res);
});

const protect = catchAsync(async (req, res, next) => {
    let token = '';

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Please login or signup!', 401));
    }

    const decode = await promisify(jwt.verify)(token, process.env.JWT_PRIVATE_KEY);

    const currentUser = await User.findById(decode.id);
    if (!currentUser) {
        return next(new AppError('Please login or signup!', 401));
    }

    if (currentUser.checkForUpdatedPasswords(decode.iat)) {
        return next(new AppError('Password was recently changed, please login again!', 401));
    }

    req.user = currentUser;
    next();
});

const authenticate = {
    signUp,
    login,
    protect
}

module.exports = authenticate;