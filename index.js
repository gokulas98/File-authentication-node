const express = require("express");
const app = express();
const pool = require("./db");

app.use(express.json());

//git

//ROUTES

//Return user details based on a user_id

app.get("/login/:emp_id/:password", async(req, res) => {
    try {

        const { emp_id, password } = req.params;
        const details = await pool.query( "SELECT emp_id, password FROM registered_employee WHERE emp_id = $1 AND password = $2",[emp_id, password]);
        
        //Authentication funcion******************
       
        if (details.rows.length>0) {
            res.set('Content-Type', 'text/plain')
            res.status(200).send('Successfully logged in')
            console.log("User authenicated")
          }
          else{
            res.status(401).send('Wrong credentials')
            console.log("User not authenticated")
        
          }

    }catch(err) {
        console.error(err.message);
    }
});

app.listen(3000, () => { 
    console.log("server is listening on port 3000");
});
