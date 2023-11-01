const exp = require("constants");
const express = require("express")
const fs = require("fs")
var morgan = require("morgan");
var tourRouter = require("./routes/tourRoutes");
var userRouter = require("./routes/userRoutes")

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



module.exports = app