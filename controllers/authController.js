const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsyc = require("../utils/catchAsyc");
const sendMail = require("../utils/sendEmail");

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

//!Protected Route
exports.protectedRoutes = catchAsyc(async (req, res, next) => {
    //TODO token exsist and reachable?
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    !token && next(new AppError("Please login to your account", 400))

    //TODO is token valid? is expired?
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.message === "jxt expired") {
            // token is unvalid due to time, expired
            return next(new AppError("Acount is unactive, please log in!", 401))
        }
        // token unvalid
        return next(new AppError("Unvalid token!"), 401)
    }

    //TODO is user account exsists after jwt provided?
    const activeUser = await User.findById(decoded.id)
    !activeUser && next(new AppError("Looks like account was deleted or unactive!", 401))

    //TODO password changed after jwt provided?
    if (activeUser.passwordChangedAfterToken(decoded.iat)) {
        return next(new AppError("You changed your password in a while, please log in again", 401))
    }
    req.user = activeUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to do this action!", 404)) //no authorization --> 404
        };
        next()
    }
}

//! Forgotten Password
exports.forgotPassword = catchAsyc(async (req, res, next) => {
    //TODO fetch user account per email user sent
    const user = await User.findOne({ email: req.body.email });

    if (!user) { return next(new AppError("No account found for this email", 404)) }

    //TODO create token for password resetting
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false })


    //TODO Send Email

    const resetUrl = `http://127.0.01:5173/api/v1/${resetToken}`

    try {
        await sendMail({
            email: user.email,
            subject: "Reset password",
            text: "Here is your reset password link. Please rest your passsword in 10 minutes! Hava a nice day " + resetUrl
        })


        res.status(200).json({
            status: "success",
            message: "reset url was send to user!"
        })

    } catch (err) {
        console.log("reset password mail nor sent -->", err);
        user.passwordResetToken = undefined
        user.passwordresetTokenExpires = undefined;
        await user.save({ validateBeforeSave: false })

        next(new AppError(
            "Error at reset password sending mail process!", 500
        ))
    }
})

//! Reset Password
exports.resetPassword = (req, res, next) => { };