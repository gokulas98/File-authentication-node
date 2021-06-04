const express = require("express");
const app = express();
const pool = require("./db");
const bcrypt= require("bcrypt")
// const requiredRoles=require("./middlewares/requiredRoles")
 
app.use(express.json());
 
//git
 
//ROUTES
 
//Return user details based on a user_id
app.get("/", async(req, res)=>{
    res.render("login.html")
})

 
app.get("/login/:emp_id/:password", async(req, res) => {
    try {
        
 
        const {emp_id,} = req.params;
        //const details = await pool.query( "SELECT emp_id, password FROM registered_employee WHERE emp_id = $1 AND password = $2",[emp_id, password]);
        
        //Authentication check******************
        const details = await pool.query( "SELECT * FROM registered_employee WHERE emp_id = $1 ",[emp_id]);
        console.log(details.rows[0].password_digest)
        console.log(details.rows[0])

        bcrypt.compare(req.params.password, details.rows[0].password_digest, function(error, result) {
            // if res == true, password matched
            // else wrong password
            if (result==true){
            console.log("Password matched")
            // res.set('Content-Type', 'text/plain')
            res.status(200)
            // res.send('Successfully logged in')
            console.log("User authenicated")
            console.log(details.rows[0].role)


            if(details.rows[0].role=="Super admin"){
                res.send("Successfully logged in as Super admin")
            } else {
                res.send("Successfully logged in as User")
            }


            }else{
            console.log("Wrong password")
            res.status(401).send('Wrong password')
            console.log("User not authenticated")
            }
        });


 
    }catch(err) {
        console.error(err.message);
        res.status(404).send("Invalid credentials")
    }

});
 
// app.get("./loggedin/superadmin", middlewares.requiredRole("Super admin"),(req,res)=>{
//     try{
//         console.log("Loggedin as Super admin")
//         res.status(200).send("You are loggerd in as Super admin")
//     }catch(err){
//         console.error(err)
//     }


// });




app.listen(3000, () => { 
    console.log("server is listening on port 3000");
});