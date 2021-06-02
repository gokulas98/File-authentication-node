const express = require("express");
const app = express();
const pool = require("./db");

app.use(express.json());

//ROUTES

//Return user details based on a user_id

app.get("/login/:emp_id/:password", async(req, res) => {
    try {

        const { emp_id, password } = req.params;
        const details = await pool.query( "SELECT emp_id, password FROM registered_employee WHERE emp_id = $1 AND password = $2",[emp_id, password]);
        if(details.rows.length == 0) {
            res.status(400);
            res.send("Error");
        }
        else {
            res.status(200);
            res.json(details.rows[0]);
        }

    }catch(err) {
        console.error(err.message);
    }
});

app.listen(3000, () => { 
    console.log("server is listening on port 3000");
});