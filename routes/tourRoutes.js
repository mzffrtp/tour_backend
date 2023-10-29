const express = require("express");
const {
    getAllTours, createTour, updateTour, deleteTour
} = require("../controllers/tourControllers")

const tourRouter = express.Router();

//tours routing
tourRouter.route("/")
    .get(getAllTours)
    .post(createTour);

tourRouter.route("/:id")
    .get(updateTour)
    .delete(deleteTour)

module.exports = tourRouter