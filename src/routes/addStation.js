const express = require("express")
const routes = express.Router();
const fs = require('fs');
const qr = require('qrcode');
const { spawn } = require('child_process');
const path = require("path");

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

    const pythonProcess = spawn('python', ['D:/SSIP-HACKATHONE-2K23-ADMIN/src/routes/generatePdf.py', district, station]);


    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(data.toString());
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            console.log('PDF generation complete');
        } else {
            console.error(`PDF generation process exited with code ${code}`);
            res.status(500).send('Error generating PDF');
        }
    });

    res.redirect(`/loginCredentials?username=${username}&password=${password}`);

})

routes.get("/loginCredentials", (req, res) => {
    const username = req.query.username; // Retrieve the username from the query parameters
    const password = req.query.password; // Retrieve the password from the query parameters

    res.render("loginCredentials", { username, password });
});

routes.get("/downloadPDF", (req, res) => {
    // Replace 'path-to-your-pdf.pdf' with the actual path to your PDF file.
    const pdfFilePath = path.join("D:/SSIP-HACKATHONE-2K23-ADMIN/public/posters/ddsf_mota varachha police station.pdf");

    // Set the filename as you want it to appear when downloaded.
    const pdfFileName = "ddsf_mota varachha police station.pdf";

    // Use res.download to send the PDF for download.
    res.download(pdfFilePath, pdfFileName, (err) => {
        if (err) {
            // Handle any errors that occur during the download.
            console.error("Error downloading PDF:", err);
            res.status(500).send("Error downloading PDF");
        }
    });
});

module.exports = routes;