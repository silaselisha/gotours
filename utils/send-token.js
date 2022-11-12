const jwtTokenGen = require('../utils/jwt-gen');

const sendToken = (statusCode, user, res) => {
    const token = jwtTokenGen(user._id);
    let secure;

    process.env.NODE_ENV === 'production' ? secure = true : secure = false;

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure
    });

    res.status(statusCode).json({
        status: 'success',
        token,
        data: user
    });
}

module.exports = sendToken;