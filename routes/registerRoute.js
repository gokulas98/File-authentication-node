const express = require('express');
const router = express.Router();
const routeController = require("../controllers/routeController");

router.post("/register" ,routeController.register);

module.exports = router;