const express = require('express');
const router = express.Router();
const passport = require('passport');
const Admin = require("../models/admins")
const stations = require('../models/stations');

router.get("/signup", (req, res) => {
    res.render("signup")
})

router.get('/', async (req, res) => {
    const districts = await stations.find()
    res.render('login', { districts });
});

// Example route for fetching police stations for a specific district
router.get('/getPoliceStations/:district', async (req, res) => {
    const districtName = req.params.district;

    try {
        // Use Mongoose to find the district by name and retrieve its police stations
        const district = await stations.findOne({ district: districtName });

        if (!district) {
            return res.status(404).json({ error: 'District not found' });
        }

        const policeStations = district.policeStations;

        res.json(policeStations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data from the database' });
    }
});


router.post("/signup", async (req, res) => {
    const { username, password, district } = req.body;

    // Check if the password field is provided in the request body
    if (!password || !district) {
        return res.render("signup", { error: "Password is required" });
    }

    // Create a new admin instance
    const newAdmin = new Admin({ username, district });

    try {
        const newDistrict = new stations({
            district,
            policeStations: [], // Initialize with an empty array
        });

        await newDistrict.save();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving data to the database');
    }

    // Register the admin with Passport (will hash the password)
    Admin.register(newAdmin, password, (err, admin) => {
        if (err) {
            console.error(err);
            res.render("signup", { error: err.message }); // Handle registration errors
        } else {
            // Log in the newly registered admin
            passport.authenticate("local")(req, res, () => {
                res.redirect("/signup"); // Redirect to the admin's dashboard after successful signup
            });
        }
    });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
}));

module.exports = router;
