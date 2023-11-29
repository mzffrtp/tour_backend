const Tour = require("../models/tourModel")
const APIFeatures = require("../utils/apiFeatures")

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
exports.getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limit()
            .pagination()

        const tours = await features.query;

        res.status(200).json({
            status: "success",
            results: tours.length,
            reqTime: req.requestTime,
            data: { tours },
        })
    } catch (err) {

        res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
};
exports.createTour = async (req, res) => {
    //! save to mongodb as document
    try {
        const newTour = await Tour.create(req.body)
        console.log("new tour", newTour);

        res.status(200).json({
            status: "success",
            data: { tour: newTour }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
        console.log("err create tour", err);
    }


};
exports.getTour = async (req, res) => {
    try {
        const tourFounded = await Tour.findById(req.params.id).populate({
            path: "review",
            select: "-createdAt"
        })
        console.log(tourFounded.guides
        );
        // const tourFounded = wait Tour.findById({_id: req.params.id})
        res.status(200).json({
            status: "success",
            data: { tourFounded }
        })
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err
        })
        console.log("get tour error", err);
    }
}
exports.updateTour = async (req, res) => {

    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body)
        console.log("updatedTour", updatedTour);
        res.status(200).json({
            status: "success",
            data: { tour: updatedTour }
        })

    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err
        })
    }

};
exports.deleteTour = async (req, res) => {
    try {
        const deletedTour = await Tour.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: "success",
            data: {
                tour: null,
            }
        })

    }
    catch (err) {
        res.status(400).json({
            status: "failed",
            message: err
        })
    }
}

