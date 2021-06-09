const express = require('express');
const router = express.Router();
const path= require("path")
const pool = require("../models/db");

const routeController = require("../controllers/routeController");

router.get('/', function(request, response) {
	response.sendFile(path.join(__dirname,'../views/login.html'))
});

router.post("/login",routeController.login);


module.exports = router;