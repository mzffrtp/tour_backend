const express = require("express");
const userRouter = express.Router();
const {
    getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe, deleteMe
} = require("../controllers/userControllers");

const { signUp, login, forgotPassword, resetPassword, protectedRoutes, updateMypassword } = require("../controllers/authController");
const { createReview } = require("../controllers/reviewController");

// password actions
userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword)
userRouter.patch("/updateMyPassword/", protectedRoutes, updateMypassword)

// update user
userRouter.patch("/updateMe", protectedRoutes, updateMe)

// unactivate account
userRouter.delete("/deleteMe", protectedRoutes, deleteMe)

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