const express = require("express");
const app = express();
const pool = require("./db");
var bodyParser = require("body-parser");

var jwt = require("jsonwebtoken");

app.use(express.json());

//CORS - Issue which can occur, when req comes from various domains on frontend. Must be done for public api;s where request comes from various domains.
var cors = require("cors");
const { request } = require("express");

// json parsers
var jsonParser = bodyParser.json();

// url encoded parser
// var urlencodedParser = bodyParser.urlencoded({extended: false});

//ROUTES

//Return user details based on a user_id

// app.get("/login/:emp_id/:password", async(req, res) => {
//     try {

//         const { emp_id, password } = req.params;
//         const details = await pool.query( "SELECT emp_id, password FROM registered_employee WHERE emp_id = $1 AND password = $2",[emp_id, password]);
        
//         //Authentication check******************
//         if(details.rows.length > 0) {
//             res.set('Content-Type', 'text/plain')
//             res.status(200).send('Successfully logged in')
//             console.log("User authenticated")
//         }
//         else{
//             res.status(401).send('Wrong credentials')
//             console.log("User not authenticated")
//         }

//     }catch(err) {
//         console.error(err.message);
//     }
// });


// middleware to verify token which is recieved with every request
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



// LOGIN
app.post("/login",jsonParser, async(req,res) => {
    try{
        if(req.body.emp_id==undefined || req.body.password==undefined) {
            res.status(500).send({error: "authentication failed"});
        }
        let emp_id = req.body.emp_id;
        let password = req.body.password;
        
        let qr = `select * from registered_employee where emp_id = '${emp_id}' and password = '${password}' `; /// need to add bcrypt(password) once bcrypt is included.
        await pool.query(qr,(err, result) =>{
            // console.log(result);
            if(err || result.rows.length==0 ){
                res.status(500).send({error: "login failed"});
            }
            else{
                // res.status(200).send({success: "login success"});
                let resp = {
                    id : result.rows[0].emp_id,
                    user_name: result.rows[0].user_name
                }
                res.set('Content-Type', 'text/plain')
                console.log("User authenticated")

                let token = jwt.sign(resp,"secret", {expiresIn:10}) // means valid for 60 seconds and second parameter is the secret code.
                res.status(200).send({auth:true, token:token});
            }
        })
    }catch(err) {
        console.error(err.message);
    }
  
});

// TO POST DETAILS OF A NEW EMPLOYEE
app.post("/register", jsonParser ,async(req, res) => {
    try{
        const emp_id = req.body.emp_id;
        const user_name = req.body.user_name;
        const email = req.body.email;
        const password = req.body.password;

        const qr = ` insert into registered_employee(emp_id, user_name, email, password) values ('${emp_id}', '${user_name}', '${email}', '${password}') `;
        await pool.query(qr, (err, result) => {
            if(err){
                res.send({error: "Operation failed"})
            }
            else {
                res.send({success: "Operation Successful"});
            }
        })
    }catch(err) {
        console.error(err.message);
    }
});

app.get("/view", verifyToken , jsonParser, async(req, res) => {
    try{
        const emp_id = req.body.emp_id;
        const tts_code = req.body.tts_code;
        const qr = ` select hours from logs where emp_id = '${emp_id}' and tts_code = '${tts_code}' `;
        await pool.query(qr, (err, result) => {
            if(err) {
                res.send({error: "Operation failed"});
            }
            else {
                if(result.rows.length == 0) {
                    res.send({error: "Invalid operation"});
                }
                else {
                    res.send(result.rows[0]);
                }
            }
        })
    }catch(err){
        console.error(err.message);
    }
})

app.listen(3000, () => { 
    console.log("server is listening on port 3000");
});