class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.statusCode = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';

        Error.captureStackTrace(this, this.costructor)
    }
}

module.exports = AppError;