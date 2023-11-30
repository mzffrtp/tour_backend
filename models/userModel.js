const { default: mongoose } = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt");
var crypto = require("crypto");
const moment = require("moment/moment");


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
        minLength: 5,
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
        },
    },
    passwordChangeAt: Date,
    role: {
        type: String,
        enum: ["user", "guide", "guideLead", "admin"],
        default: "user"
    },
    passwordResetToken: String,

    passwordresetTokenExpires: Date,

    active: {
        type: String,
        default: true,
        select: false
    }
});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
})

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();
    this.passwordChangeAt = Date.now() - 1000;
    next();
})


userSchema.methods.correctPassword = async function (providedPassword, userPassword) {

    return await bcrypt.compare(providedPassword, userPassword)
};

userSchema.methods.passwordChangedAfterToken = function (JWTTimestamp) {

    if (this.passwordChangeAt) {
        const changedTimeStamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10)

        return JWTTimestamp < changedTimeStamp
    };
    return false
};

userSchema.methods.createPasswordResetToken = function () {

    //!token for resetting password
    const resetToken = crypto.randomBytes(33).toString("hex")
    console.log(resetToken);

    //! token saved in db  encrypted due to security reasons
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    this.passwordresetTokenExpires = moment(Date.now()).add(10, "minutes")

    return resetToken
};

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } })
    next()
})

const User = mongoose.model("User", userSchema);
module.exports = User