const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<PASS>", process.env.DATABASE_PASS);

console.log("DB", DB);

mongoose
    .connect(DB)
    .then(() => console.log("server connected"))
    .catch(() => console.log("server not connected"))

const port = process.env.PORT || 5173;

app.listen(port, () => [
    console.log(`app listening on ${port} `)
])