const express = require("express")
const routes = express.Router();
const fs = require('fs');
const qr = require('qrcode');

routes.get("/addStation", async (req, res) => {
    res.render("addStation")
})

function trimAndCleanString(input) {
    // Remove "police station" and trim any leading/trailing spaces
    let trimmed = input.replace(/police station/i, '').trim();
    // Replace any remaining spaces with underscores
    trimmed = trimmed.replace(/\s+/g, '_');
    trimmed = trimmed.toLowerCase();
    return trimmed;
}

routes.post("/addPoliceStation", async (req, res) => {
    const station = req.body.station;

    const district = "ddsf"
    const trimmedStation = trimAndCleanString(station)

    const username = `${district}.${trimmedStation}@gmail.com`
    const password = `${trimmedStation}@123`

    const url = `http://localhost:2000/feedback-form?district=${district}&station=${station}`

    const options = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
    };

    qr.toFile('public/images/qr-code.png', url, options, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error generating QR code');
        } else {
            console.log('QR code generated and saved as qr-code.png (overwritten)');
        }
    });

    console.log(username)
    console.log(password)


})


module.exports = routes;