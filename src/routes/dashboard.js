const express = require("express")
const routes = express.Router();
const {ensureAuthenticated} = require("../controller/authMiddleware")

routes.get("/dashboard", (req, res) => {
    const userRole = req.query
    res.render("dashboard",{userRole:"State Administrator"})
})

module.exports = routes;