const Review = require("../models/reviewModel")
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlerFactory")



exports.setTourUserIds = (req, res, next) => {
    //TODO 1- if tour is not defined in request
    if (!req.body.tour) req.body.tour = req.params.tourId;

    //TODO 2- if user is not defined in request   
    if (!req.body.user) req.body.user = req.user.id;

    next();
}

exports.getAllReviews = getAll(Review)
exports.createReview = createOne(Review);

exports.deleteReview = deleteOne(Review);

exports.updateReview = updateOne(Review);

exports.getReview = getOne(Review);



