const { default: mongoose } = require("mongoose");
const validator = require("validator")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please write you name"]
    },
    email: {
        type: String,
        required: [true, "e-mail shouldn´t be blank"],
        unique: true,
        lowerCase: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: 8,
        select: false
    },

    passwordConfirm: {
        type: String,
        required: [true, "please confirm your password"],
        validate: {
            validator: function (value) {
                return value === this.password
            },
            message: "Please confirm your password!"
        }
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User