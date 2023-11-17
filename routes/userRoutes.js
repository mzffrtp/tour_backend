const express = require("express");
const userRouter = express.Router();
const {
    getAllUsers, createUser, getUser, updateUser, deleteUser
} = require("../controllers/userControllers");

const { signUp, login, forgotPassword, resetPassword } = require("../controllers/authController");

// password actions
userRouter.post("/forgotPassword", forgotPassword);
userRouter.post("/resetPassword", resetPassword)

//authentication routes
userRouter.post("/signup", signUp)

//login route
userRouter.post("/login", login)

//users routing
userRouter
    .route("/")
    .get(getAllUsers)
    .post(createUser)

userRouter
    .route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = userRouter