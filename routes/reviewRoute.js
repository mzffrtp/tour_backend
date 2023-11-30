const express = require("express");
const { deleteReview, updateReview, setTourUserIds, getReview, createReview, getAllReviews } = require("../controllers/reviewController");
const { protectedRoutes } = require("../controllers/authController");

const reviewRouter = express.Router({ mergeParams: true });

//! mergeParams--> for using params in different routes

//!
reviewRouter.use(protectedRoutes)

reviewRouter.get("/", getAllReviews)

reviewRouter
    .post("/", setTourUserIds, createReview)
    .delete("/", deleteReview)
    .patch("/", updateReview)

reviewRouter
    .get("/:id", getReview)
module.exports = reviewRouter