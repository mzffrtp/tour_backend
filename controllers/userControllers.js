const multer = require("multer")
const User = require("../models/userModel")
const AppError = require("../utils/appError")
const catchAsyc = require("../utils/catchAsync")
const filterObj = require("../utils/filterObj")
const { deleteOne, updateOne, getAll } = require("./handlerFactory")

exports.getAllUsers = getAll(User)
exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "route not defined yet"
    })
}
exports.getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "route not defined yet"
    })
}
exports.updateUser = updateOne(User)
exports.deleteUser = deleteOne(User)

exports.updateMe = catchAsyc(async (req, res, next) => {
    //TODO 1- error for password updating
    if (req.body.password || req.body.passwordConfirm)
        return next(new AppError("You shouldn´t update your password here!", 400));

    //tODO 2- update user info
    const filteredreqBody = filterObj(req.body, "name", "email");

    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredreqBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: {
            user: updateUser
        }
    })
})

exports.deleteMe = catchAsyc(async (req, res, next) => {
    // TODO find user and UNACTIVATE
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        staus: "success",
        data: null
    })
})

//! multer - file uploading
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/img/users")
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        cb(null, `/user-${req.user.id}-${Date.now()}.${ext}`)
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new AppError("Extension not supported!", 400), false)
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single("photo")
