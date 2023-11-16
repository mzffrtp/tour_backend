const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsyc = require("../utils/catchAsyc");

//!new account sign up
exports.signUp = catchAsyc(async (req, res, next) => {
    try {
        const newUser = await User.create(req.body)

        //!JWT token
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES });

        res.status(200).json({
            status: "success",
            message: "user succesfully added!",
            token,
            data: { newUser }
        })
    } catch (err) {
        next(new AppError("Pls enter your mail and password!", 400))
    }
});

//! LOGIN
exports.login = catchAsyc(async (req, res, next) => {

    const { email, password } = req.body;

    // email, pasword exsists?
    if (!email || !password) {
        next(new AppError("Email and password shoul not be blank!",))
    }

    // user with the email exits?
    //TODO ---> .select("+password") !!! pasword is secret, add select in order to compare for JWT
    const user = await User.findOne({ email }).select("+password")

    //password right?
    //TODO --> to compare provide a mothod
    //? see user model for more!!!
    const correctPassword = await user.correctPassword(password, user.password)

    correctPassword ?
        res.status(200).json({
            status: "success",
            message: "user loged in suceessfully",
            token: " "
        }) :
        next(new AppError("Please provide your email and password", 400))
});