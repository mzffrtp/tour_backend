const express = require("express");
const userRouter = express.Router();
const {
    getAllUsers, createUser, getUser, updateUser, deleteUser
} = require("../controllers/userControllers");
const { signUp, login } = require("../controllers/authController");

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