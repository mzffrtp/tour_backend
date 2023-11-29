const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" })

const Tour = require("../../models/tourModel");
const DB = process.env.DATABASE.replace("<PASS>", process.env.DATABASE_PASS);

mongoose
    .connect(DB)
    .then(() => console.log("server connected"))
    .catch(() => console.log("server not connected"))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`))
const importData = async () => {
    try {
        await Tour.create(tours)
        process.exit()
    }
    catch (err) {
        console.log(err)
    }
};
const deleteData = async () => {
    try {
        await Tour.deleteMany();
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