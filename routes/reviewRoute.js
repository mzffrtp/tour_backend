const express = require("express");
const { getAllReviews, createReview } = require("../controllers/reviewController");
const { protectedRoutes } = require("../controllers/authController");

const reviewRouter = express.Router({ mergeParams: true });
//! mergeParams--> for using params in different routes
reviewRouter
    .get("/", getAllReviews)
    .post("/", protectedRoutes, createReview)

module.exports = reviewRouter