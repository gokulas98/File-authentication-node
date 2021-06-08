const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const routeController = require("../controllers/routeController");
router.post("/login",jsonParser, routeController.login);

module.exports = router;