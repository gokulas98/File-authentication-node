const express = require('express');
const router = express.Router();
const routeController=require("../controllers/routeController")


router.get('/userhome',routeController.verifyCookieToken, routeController.userHome);

// router.get('/superadmin',routeController.verifyCookieToken, routeController.superadmin);

module.exports = router;