const express = require("express")
const fs = require("fs")
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const rateLimiter = require("./utils/rateLimiter");
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const reviewRouter = require("./routes/reviewRoute");

const app = express();
app.use(express.json({ limit: "10kb" }))


//! middleware 
app.use(morgan("dev"))

//! SECURITY
app.use("/api", rateLimiter);
app.use(helmet());
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);
app.use(xssClean());
app.use(hpp({
    whitelist: [
        "duration",
        "difficulty",
        "price"
    ]
}))

app.use((req, res, next) => {
    req.requestTime = new Date().toDateString();
    next();
})
//routes
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/review", reviewRouter)


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