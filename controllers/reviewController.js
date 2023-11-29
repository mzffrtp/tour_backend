const Review = require("../models/reviewModel")
const catchAsync = require("../utils/catchAsyc")

exports.getAllReviews = catchAsync(async (req, res, next) => {

    //? "/review" --> fetch all reviews
    //? "/tours(tour_id/review" --> reviews for the special tour
    //TODO 1- filter as params

    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }
    const reviews = await Review.find(filter);

    res.status(200).json({
        status: "success",
        results: reviews.length,
        data: {
            reviews
        }
    })
})

exports.createReview = catchAsync(async (req, res, next) => {
    //TODO 1- if tur is not defined in request
    if (!req.body.tour) req.body.tour = req.params.tourId

    //TODO 2- if user is not defined in request   
    if (!req.body.user) req.body.user = req.user.id
    console.log(req.user.id);
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            newReview
        }
    })
})