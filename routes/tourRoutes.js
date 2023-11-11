const express = require("express");
const {
    getAllTours, createTour, updateTour, deleteTour, getTour, aliasTopTours, getTourStats, getMonthlyPlan
} = require("../controllers/tourControllers")

const tourRouter = express.Router();

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
    .get(getAllTours)
    .post(createTour);

tourRouter
    .route("/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)



module.exports = tourRouter