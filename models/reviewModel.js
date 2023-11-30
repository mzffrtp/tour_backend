const mongoose = require("mongoose")
const Tour = require("./tourModel")

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review should not be blank"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "Which tour do you comment on?"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Who is commenting?"]
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "tour",
        select: "name"
    }).populate({
        path: "user"
    })
    next()
})

reviewSchema.statics.calcAvaRat = async function (tourId) {
    const ratingStats = await this.aggregate([
        //TODO 1 - get the matching tour Id
        {
            $match: { tour: tourId }
        },
        //TODO 2- total reviews and ave. rating
        {
            $group: {
                _id: "$tour",
                nRating: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        }
    ]);

    if (ratingStats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: ratingStats[0].avgRating,
            ratingsQuantity: ratingStats[0].nRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 4,
            ratingsQuantity: 0
        })
    }

}

//! calculating rating with a new review
reviewSchema.post("save", async function (doc) {
    this.constructor.calcAvaRat(this.tour)
})
//! calculating rating with updating and deleting a review
reviewSchema.post(/^findByIdAnd/, async function (doc) {
    await doc.constructor.calcAvaRat(doc.tour)
})

//! one person can review one tour once, blocks the second one
reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

const Rewiew = mongoose.model("Review", reviewSchema);

module.exports = Rewiew