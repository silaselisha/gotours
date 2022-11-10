const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const User = require('../models/user-modle');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');
const sendMail = require('../utils/send-mails');

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

    if (!user) {
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

    if (!user) {
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

const forgortPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('To reset your password, kindly provide your email!', 400));
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        return next(new AppError('Please provide a valid email address!', 404));
    }

    const resetToken = user.resetTokenGen();
    user.save({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

    const message = `Please reset your password by clicking this link ${resetUrl} The link will expire in 10 minutes. Ignore this message if you did not request for a password reset.`;

    try {
        await sendMail({email, message});

        res.status(200).json({
            status: 'success',
            message: 'Password reset token is sent.'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiresIn = undefined;
        await user.save({validateBeforeSave: false});

        return next(new AppError('Email unsuccessfully sent!', 400));
    }
});

const resetPassword = catchAsync(async (req, res, next) => {
    const {password, confirmPassword} = req.body;

    const resetToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({passwordResetToken: resetToken, passwordResetTokenExpiresIn: {$gt: Date.now()}})

    if(!user) {
        return next(new AppError('Invalid token, please request for a new token.', 400));
    }
  
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;

    await user.save();

    const token = jwt.sign({id: user._id}, process.env.JWT_PRIVATE_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({
        status: 'success',
        token
    });
});

const usersHandlers = {
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    forgortPassword,
    resetPassword
};

module.exports = usersHandlers;