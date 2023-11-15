const User = require("../models/userModel");
const jwt = require("jsonwebtoken")

//!new account sign up
exports.signUp = async (req, res) => {
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
        res.status(400).json({
            status: "failed",
            message: err.message
        })

    }
};

//! LOGIN
exports.login = async (req, res) => {

    const { email, password } = req.body;

    // email, pasword exsists?
    if (!email || !password)
        return res.status(400).json({
            status: "failed",
            message: "Please provide email and password in order to log in"
        })

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
        res.status(400).json({
            status: "failed",
            message: "email or password wrong"
        })
}