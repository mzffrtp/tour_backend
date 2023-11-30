const Tour = require("../models/tourModel")
const APIFeatures = require("../utils/apiFeatures");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlerFactory");

//! ALIAS
//TODO middelware , "next" in params
exports.aliasTopTours = (req, res, next) => {

    req.query.limit = "5";
    req.query.sort = "-ratingsAvarage,price";
    req.query.fields = "name,duration,price,ratingsAvarage";
    next(); //! IMPORTANT
};

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                //! LIST --> first stage
                $match: { ratingsAverage: { $gte: 4 } }
            },
            {
                //! GROUP --> second stage
                $group: {
                    _id: { $toUpper: "$difficulty" },
                    tourCount: { $sum: 1 },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }
                }
            },
            {
                //! SORT
                $sort: { avgPrice: -1 }
                //? + --> ascending, - --> descending
            },
            {
                $match: { minPrice: { $gte: 400 } }
            }
        ])

        res.status(200).json({
            status: "success",
            results: stats.length,
            data: { stats }
        })
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1
        const monthlyPlan = await Tour.aggregate([
            { //? to divide arrays into parts
                $unwind: "$startDates"
            },
            {
                //!FILTERS the documents passed to the next stage
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$startDates" },
                    numTourStats: { $sum: 1 },
                    tourNames: { $push: "$name" },
                    rating: { $push: "$rating" }

                }
            },
            {
                $addFields: { month: "$_id", }
            },
            {
                $project: { _id: 0, rating: 0 }
            }
        ])

        res.status(200).json({
            status: "success",
            results: monthlyPlan.length,
            data: { monthlyPlan }
        })
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err.message
        })
    }


}
exports.getAllTours = getAll(Tour)
exports.createTour = createOne(Tour, { path: "review" })

exports.getTour = getOne(Tour)
exports.updateTour = updateOne(Tour)
exports.deleteTour = deleteOne(Tour)

