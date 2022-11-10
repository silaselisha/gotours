const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');
const User = require('../models/user-modle');

const jwtTokenGen = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    return token;
}

const signUp = catchAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

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
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Provide both email and password', 400));
    }

    const user = await User.findOne({ email: email }).populate('password');

    if (!user || !await user.validatePassword(password, user.password)) {
        return next(new AppError('Provide correct user email or password!', 400));
    }

    const token = jwtTokenGen(user._id);

    res.status(200).json({
        status: 'success',
        token
    });
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

const restrict = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You don\'t have permission!', 401));
        }
        next();
    }
}

const authenticate = {
    signUp,
    login,
    protect,
    restrict
}

module.exports = authenticate;