const express = require("express");
const userRouter = express.Router();
const {
    getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe, deleteMe
} = require("../controllers/userControllers");

const { signUp, login, forgotPassword, resetPassword, protectedRoutes, updateMypassword, restrictTo } = require("../controllers/authController");
const { createReview } = require("../controllers/reviewController");

//authentication routes
userRouter.post("/signup", signUp)

//login route
userRouter.post("/login", login)

// password actions
userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword)


//!
userRouter.use(protectedRoutes)

userRouter.patch("/updateMyPassword/", updateMypassword)

// update user
userRouter.patch("/updateMe", updateMe)

// unactivate account
userRouter.delete("/deleteMe", deleteMe)

//!
userRouter.use(restrictTo("admin"))

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