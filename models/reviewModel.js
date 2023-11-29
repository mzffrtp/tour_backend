const mongoose = require("mongoose")

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
const Rewiew = mongoose.model("Review", reviewSchema);

module.exports = Rewiew