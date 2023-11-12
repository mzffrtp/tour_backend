const mongoose = require("mongoose");
const { default: slugify } = require("slugify");





const tourSchema = new mongoose.Schema({
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
    },
    slug: {
        type: String
    }
},
    //TODO for sending virtual properties to frontend
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

//! VIRTUAL PROPERTY
// other information by frontend, but not needed held in our backend server
tourSchema.virtual("durationWeek").get(function () {
    return this.duration / 7;
})

//! DOCUMNET MIDDLEWAREs
tourSchema.pre("save", function (next) {
    this.slug = slugify(this.name)
    next();
})

tourSchema.post("save", function (doc, next) {
    console.log("saved document-->, doc")
    next()
})
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour