const express = require('express');
const router = express.Router();
const passport = require('passport');
const Admin = require("../models/admins")

router.get("/signup", (req, res) => {
    res.render("signup")
})

router.post("/signup", (req, res) => {
    const { username, password, firstName, lastName, badgeNumber, role } = req.body;

    // Check if the password field is provided in the request body
    if (!password) {
        return res.render("signup", { error: "Password is required" });
    }

    // Create a new admin instance
    const newAdmin = new Admin({ username, firstName, lastName, badgeNumber, role });

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
