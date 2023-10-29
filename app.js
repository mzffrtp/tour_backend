const exp = require("constants");
const express = require("express")
const fs = require("fs")
var morgan = require("morgan");
var tourRouter = require("./routes/tourRoutes");
var userRouter = require("./routes/userRoutes")

const app = express();
app.use(express.json())

//constants
const port = 5173;


//! middleware 
app.use(morgan("dev"))
app.use((req, res, next) => {
    req.requestTime = new Date().toDateString();
    next();
})
//routes
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});