const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    role: {
        type: String,
        default: "District Administrator",
    },
});

adminSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Admins", adminSchema);