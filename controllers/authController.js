const User = require("../models/userModel")

exports.signUp = async (req, res) => {
    try {
        const newUser = await User.create(req.body)

        res.status(200).json({
            status: "success",
            message: "user succesfully added!",
            data: { newUser }
        })
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err.message
        })

    }
}