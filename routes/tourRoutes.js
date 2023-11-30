const express = require("express");
const {
    getAllTours, createTour, updateTour, deleteTour, getTour, aliasTopTours, getTourStats, getMonthlyPlan, getToursWithin, getDistanceTour
} = require("../controllers/tourControllers");
const { protectedRoutes, restrictTo } = require("../controllers/authController");
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
    .get(protectedRoutes, restrictTo("admin"), getMonthlyPlan)

// Geo routes
tourRouter.get("/tours-within/:distance/center/:latlng/unit/:unit", getToursWithin)

tourRouter.get("/distances/:latlng/unit/:unit", getDistanceTour)

// common
tourRouter
    .route("/")
    .get(getAllTours)
    .post(protectedRoutes, restrictTo("admin"), createTour);

tourRouter
    .route("/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(
        protectedRoutes,
        restrictTo("admin", "guideLead"),
        deleteTour)

module.exports = tourRouter