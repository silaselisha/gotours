const jwt = require('jsonwebtoken');

const jwtTokenGen = (id) => {
    const token = jwt.sign({id}, process.env.JWT_PRIVATE_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    return token;
}

module.exports = jwtTokenGen;