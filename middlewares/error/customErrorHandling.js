const customErrorHandler = (err, req, res, next) => {

    let customError = err;
    if (err.name === "ValidationError") { customError.message = err.message }
    if (err.name === "SyntaxError") { customError.message = "Syntax Error" }
    if (err.name === "CastError") { customError.message = "Valid id"; customError.status = 400 }
    res
        .status(customError.status || 500)
        .json({
            success: false,
            message: customError.message || err.message
        })

}

module.exports = customErrorHandler