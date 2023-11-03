const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const hbs = require("hbs");
const session = require("express-session")
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const manageQuestionsRoute = require("./routes/manageQuestions");
const Admin = require("./models/admins")
const adminRoute = require("./routes/admin")
const dashboardRoute = require("./routes/dashboard")
const addStationRoute = require("./routes/addStation")
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use(express.static(path.join(__dirname)));

app.use(session({
    secret: 'your-secdcscdsret-key', // Change this to a strong, random string
    resave: false,
    saveUninitialized: false,
}));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("", manageQuestionsRoute);
app.use("", adminRoute);
app.use("", dashboardRoute);
app.use("", addStationRoute);


app.set("view engine", "hbs");
app.set("views", "views");
hbs.registerPartials("views/partials");
hbs.registerHelper('eq', function (v1, v2) {
    return v1 === v2;
});

passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.get("/getPDF", (req, res) => {
    // Replace 'path-to-your-pdf.pdf' with the actual path to your PDF file.
    const pdfFilePath = path.join("D:/SSIP-HACKATHONE-2K23-ADMIN/public/posters/ddsf_mota varachha police station.pdf");
    
    // Send the PDF file as a response
    res.sendFile(pdfFilePath);
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