const express = require("express");
const {
    getAllTours, createTour, updateTour, deleteTour, getTour, aliasTopTours, getTourStats, getMonthlyPlan
} = require("../controllers/tourControllers");
const { protectedRoutes, restrictTo } = require("../controllers/authController");
const { createReview } = require("../controllers/reviewController");
const reviewRouter = require("./reviewRoute");

const tourRouter = express.Router()

// nested tours
tourRouter.use("/:tourId/review", reviewRouter)

//tours routing
tourRouter
    .route("/top-five-best")
    .get(aliasTopTours, getAllTours)

//stats
tourRouter
    .route("/tour-stats")
    .get(getTourStats)

tourRouter
    .route("/montly-plan/:year")
    .get(getMonthlyPlan)

// common
tourRouter
    .route("/")
    .get(protectedRoutes, getAllTours)
    .post(protectedRoutes, createTour);

tourRouter
    .route("/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(
        protectedRoutes,
        restrictTo("admin", "guideLead"),
        deleteTour)

module.exports = tourRouter