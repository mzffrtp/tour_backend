const express = require("express");
const { getAllReviews, createReview } = require("../controllers/reviewController");
const { protectedRoutes } = require("../controllers/authController");

const reviewRouter = express.Router();

reviewRouter
    .get("/", protectedRoutes, getAllReviews)
    .post("/", createReview)

module.exports = reviewRouter