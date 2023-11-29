const express = require("express");
const {
    getAllTours, createTour, updateTour, deleteTour, getTour, aliasTopTours, getTourStats, getMonthlyPlan
} = require("../controllers/tourControllers");
const { protectedRoutes, restrictTo } = require("../controllers/authController");
const { createReview } = require("../controllers/reviewController");

const tourRouter = express.Router();

// nested tours
tourRouter.route("/:tourId/review").post(protectedRoutes, createReview)

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