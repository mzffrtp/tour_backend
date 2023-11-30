const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const validator = require("validator")

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, "one name for one tour"],
        required: [true, "all tours should have a name"],
        minLength: [5, "Name should include minumum 5 characters"],
        maxLength: [20, "Name should include maximum 20 characters"],
        validate: [validator.isAlpha, "name should include just letters"]
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
        required: [true, "all tours should have a difficulty"],
        enum: {
            values: ["easy", "medium", "difficult"],
            message: "Difficulty level should be easy, medium or difficult"
        }
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
    //TODO
    /*
    priceDiscount: {
        validate: {
            validator: function (value) {
                return value < this.price
            },
            message: "Price discount shouldn´t be more than price"
        }
    },
    */
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
    },
    startLocation: {
        description: String,
        type: {
            type: String,
            default: "Point",
            enum: ["Point"],
        },
        coordinates: [Number],
        address: String
    },
    locations: [{
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        description: String,
        coordinates: [Number],
        day: Number,
        address: String
    }],
    guides: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
    }],
},
    //TODO for sending virtual properties to frontend
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })
//! INDEX for performance
//? descending price, ascending rating index
tourSchema.index({ price: 1, ratingsAverage: -1 })

//! VIRTUAL PROPERTY
// other information by frontend, but not needed held in our backend server
tourSchema.virtual("durationWeek").get(function () {
    return this.duration / 7;
})

//! VIRTUAL POPULATE
tourSchema.virtual("review", {
    ref: "Review",
    foreignField: "tour",
    localField: "_id"
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


//! QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    next()
});
//? POPULATE--> 
tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: "guides",
        select: "-__v -passwordChangedAt -passwordResetToken -passwordresetTokenExpires"
    });
    next();
})

//! AGGRETAION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({
        $match: { secretTour: { $ne: true } }
    });
    next();
})


//TODO
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour