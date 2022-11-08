const User = require('../models/user-modle');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');

const getUsers = catchAsync(async (req, res, next) => {
    const users = await User.find({});

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: users
    });
});

const getUser = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if(!user) {
        return next(new AppError('The user does not exist', 404));
    }

    res.status(200).json({
        status: 'success',
        data: user
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true
    });

    if(!user) {
        return next(new AppError('Could not update the users details!', 400));
    }

    res.status(200).json({
        status: 'success',
        data: user
    });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        return next(new AppError('Could not delete the users details!', 400));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

const createUser = catchAsync(async (req, res, next) => {
    const {name, email, password, confirmPassword} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        confirmPassword
    });

    if(!user) {
        return next(new AppError('Error occured during creation of a new user account!', 400));
    }

    res.status(201).json({
        status: 'success',
        data: user
    });
});

const usersHandlers = {
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    createUser
};

module.exports = usersHandlers;