const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const hbs = require("hbs");

const manageQuestionsRoute = require("./routes/manageQuestions");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.use("", manageQuestionsRoute);

app.set("view engine", "hbs");
app.set("views", "views");
hbs.registerPartials("views/partials");
hbs.registerHelper('eq', function (v1, v2) {
    return v1 === v2;
});

//DataBase Connection
main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/SSIP-Hackathone-2k23");
    console.log("Database connected");
}

app.listen(2000, () => {
    console.log("Server started on port 2000")
})