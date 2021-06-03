const express = require("express");
const app = express();
const pool = require("./db");
const bcrypt= require("bcrypt")
 
app.use(express.json());
 
//git
 
//ROUTES
 
//Return user details based on a user_id
 
app.get("/login/:emp_id/:password", async(req, res) => {
    try {
 
        const {emp_id,} = req.params;
        //const details = await pool.query( "SELECT emp_id, password FROM registered_employee WHERE emp_id = $1 AND password = $2",[emp_id, password]);
        
        //Authentication check******************
        const hash = await pool.query( "SELECT password_digest FROM registered_employee WHERE emp_id = $1 ",[emp_id]);
        console.log(hash.rows[0].password_digest)

        bcrypt.compare(req.params.password, hash.rows[0].password_digest, function(error, result) {
            // if res == true, password matched
            // else wrong password
            if (result==true){
            console.log("Password matched")
            res.set('Content-Type', 'text/plain')
            res.status(200).send('Successfully logged in')
            console.log("User authenicated")
            }else{
            console.log("Wrong password")
            res.status(401).send('Wrong credentials')
            console.log("User not authenticated")
            }
        });
 
    }catch(err) {
        console.error(err.message);
    }
});
 


app.listen(3000, () => { 
    console.log("server is listening on port 3000");
});