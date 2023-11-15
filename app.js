const exp = require("constants");
const express = require("express")
const fs = require("fs")
var morgan = require("morgan");
var tourRouter = require("./routes/tourRoutes");
var userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");

const app = express();
app.use(express.json())

//constants


//! middleware 
app.use(morgan("dev"))
app.use((req, res, next) => {
    req.requestTime = new Date().toDateString();
    next();
})
//routes
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

//! undefined route - error management
app.all("*", (req, res, next) => {
    next(new AppError("Undefined path, check your url!", 404))
})

//! GLOBAL ERROR MANAGEMENT
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error"

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
    console.log(err.stack);
})

module.exports = app