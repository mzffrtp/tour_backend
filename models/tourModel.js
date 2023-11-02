const mongoose = require("mongoose");

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        unique: [true, "one name for one tour"],
        required: [true, "all tours should have a name"]
    },
    rating: {
        type: Number,
        default: 4.0
    },
    price: {
        type: Number,
        required: [true, "tour shold have a price"]
    },
    isPremiun: Boolean
})

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour