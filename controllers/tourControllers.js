const Tour = require("../models/tourModel")
const APIFeatures = require("../utils/apiFeatures")

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
        console.log(err)

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

        res.status(200).json({
            status: "success",
            data: { tour: newTour }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }


};
exports.getTour = async (req, res) => {
    try {
        const tourFounded = await Tour.findById(req.params.id)
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

    }
}
exports.updateTour = async (req, res) => {

    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body)
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