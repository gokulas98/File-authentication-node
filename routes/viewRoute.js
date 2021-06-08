const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const jwt = require("jsonwebtoken");
const routeController = require("../controllers/routeController");

function verifyToken(req, res, next) {
    let authHeader = req.headers.authorization;
    if(authHeader==undefined) {
        res.status(401).send({error:"no token provided"}) // means there is no authHeader, and that means user is not having token. Thus he is unauthorized.
    }
    let token = authHeader.split(" ")[1] // in authorization header, it will include bearer <token>, we need only token. So we split based on space and then choose the second substring.
    jwt.verify(token,"secret", function(err,decoded) {  // here we give the secret word, which we used while generating the token
        if(err) {
            res.status(500).send({error: "authentication failed"})
        }
        else {
            next();
        }
    }) 
}

router.get("/view", verifyToken , jsonParser, routeController.view);

module.exports = router;