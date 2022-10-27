const catchAsync = () => {
    return (req, res, next) => {
        return next().catch((err) => err)
    }
}

module.exports = catchAsync;