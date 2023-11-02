const mongoose = require("mongoose");

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        unique: [true, "one name for one tour"],
        required: [true, "all tours should have a name"]
    },
    duration: {
        type: Number,
        required: [true, "all tours should have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "all tours should have a maxGroupSize"]
    },
    difficulty: {
        type: String,
        required: [true, "all tours should have a difficulty"]
    },
    ratingsAverage: {
        type: Number,
        default: 4.0
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 4.0
    },
    price: {
        type: Number,
        required: [true, "tour shold have a price"]
    },
    summary: {
        type: String,
        trim: true,
        maxLength: 300,
        required: [true, "all tours should have a summary"]
    },
    description: {
        type: String,
        maxLength: 1000,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "all tours should have an image cover"]
    },
    images: {
        type: [String]
    },
    startDates: [Date],
    createdAt: {
        type: Date,
        default: Date.now()
    }


})

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour