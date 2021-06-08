const express = require("express");
const cors = require('cors')
const app = express();

const loginRoute = require('./routes/loginRoute');
const viewRoute = require('./routes/viewRoute');
const registerRoute = require('./routes/registerRoute');

//MIDDLEWARE
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers','*');
    if( req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use(express.json());

// ROUTES
app.use(loginRoute);

// TO POST DETAILS OF A NEW EMPLOYEE
app.use(registerRoute);

// TO VIEW DETAILS
app.use(viewRoute);

app.listen(3000, () => { 
    console.log("server is listening on port 3000");
});


//CORS - Issue which can occur, when req comes from various domains on frontend. Must be done for public api's where request comes from various domains.
// var cors = require("cors");
// const { request } = require("express");

// // json parsers
// var jsonParser = bodyParser.json();

// url encoded parser
// var urlencodedParser = bodyParser.urlencoded({extended: false});


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