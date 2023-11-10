const Tour = require("../models/tourModel.js")

exports.getAllTours = async (req, res) => {
    try {
        //! when the request queries from postman don´t match queries in mongoose

        //TODO ---> start <---
        const queryObj = { ...req.query } // move queries into an object

        // TODO 2  START ---> sort, limit, page, fields actions <---
        //? for these actions those words should be removed from request query coming from postman


        const excludedQuery = ["sort", "limit", "page", "fields"]
        excludedQuery.forEach((excEl) => delete queryObj[excEl]);

        //!
        // TODO 2 END ---> sort, limit, page, fields actions <---

        let queryString = JSON.stringify(queryObj) //obj--> stiring in order to make changes
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (ope) => `$${ope}`
        )
        //! !!! DONOT FORGET TO PARSE STRING TO JSON FOR FIND !!!
        let queryStringToJson = JSON.parse(queryString)
        //TODO ---> end <---

        //! FILTERing queries
        //? more used method for queries
        let query = Tour.find(queryStringToJson);
        /* 
        //! shoukd be known
        const tours = await Tour.find().where("duration").equals(5).where("difficulty").equals("easy"); */

        //!SORTing queries
        if (req.query.sort) {
            const sortedByMany = req.query.sort.split(",").join(" ")
            //formating postman query, removing comma joining with blank
            query = query.sort(sortedByMany)
        } else {
            query = query.sort("-createdAt")
        }

        //!FIELD LIMITing
        //? EX:not all information on a detail page
        //TODO put - before field area
        if (req.query.fields) {
            const selectedFields = req.query.fields.split(",").join(" ");
            query = query.select(selectedFields)
            //! select --> istenilen alanlarini secilmsi icin
        } else {
            query = query.select("-__v")
        }

        //!PAGINATION skip and page
        //? skip--> how many will be skipped
        //? limit -->max document on page
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = limit * (page - 1)
        query = query.skip(skip).limit(limit)

        const tours = await query
        res.status(200).json({
            status: "success",
            results: tours.length,
            reqTime: req.requestTime,
            data: { tours },

        })

    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err
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