const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const catchAsyc = require("../utils/catchAsync");


exports.deleteOne = (Model) => catchAsyc(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) { return next(new AppError(`${Model.collection.collectionName} not found!`, 404)) }

    res.status(204).json({
        status: "success",
        data: {
            data: null
        }
    })
});

exports.updateOne = (Model) => catchAsyc(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!doc) { return next(new AppError(`${Model.collection.collectionName} not found!`, 404)) }

    res.status(200).json({
        status: "success",
        data: {
            data: doc
        }
    })
});

exports.createOne = (Model) => catchAsyc(async (req, res, next) => {
    const newDoc = await Model.create(req.body)

    res.status(200).json({
        status: "success",
        data: {
            data: newDoc
        }
    })
});

exports.getOne = (Model, populateOpts) => catchAsyc(async (req, res, next) => {
    let query = Tour.findById(req.params.id);

    if (populateOpts) query = query.populate(populateOpts)

    const doc = await query

    if (!doc) { return next(new AppError(`${Model.collection.collectionName} not found!`, 404)) }

    res.status(200).json({
        status: "success",
        data: {
            data: doc
        }
    })
})

// Define getAll function
exports.getAll = (Model) => catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limit()
        .pagination();

    const docs = await features.query.explain();

    res.status(200).json({
        status: 'success',
        results: docs.length,
        data: { docs },
    });
})
