const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    district: String,
    policeStations: [String],
});

module.exports = mongoose.model('District', districtSchema);
