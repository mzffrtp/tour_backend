const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" })

const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel")

const DB = process.env.DATABASE.replace("<PASS>", process.env.DATABASE_PASS);

mongoose
    .connect(DB)
    .then(() => console.log("server connected"))
    .catch(() => console.log("server not connected"))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`))


const importData = async () => {
    try {
        await Tour.create(tours)
        await User.create(users)
        await Review.create(reviews)

        process.exit()
    }
    catch (err) {
        console.log(err)
    }
};
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();

        process.exit();
    } catch {
        console.log(err)
    }
}

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData()
}

//! Cleaning DB
  //? node ./dev-data/data/import-dev-data.js --delete

//! Migrating to DB
  //? node ./dev-data/data/import-dev-data.js --import