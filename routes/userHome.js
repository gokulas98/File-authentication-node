const express = require('express');
const router = express.Router();
const routeController=require("../controllers/routeController")


router.get('/userhome',routeController.verifyCookieToken, routeController.userHome);

module.exports = router;