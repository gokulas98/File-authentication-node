const pool = require("../models/db");
const bcrypt= require('bcrypt');
const jwt = require("jsonwebtoken");

const login = async(req,res) => {
    try{
        if(req.body.emp_id==undefined || req.body.password==undefined) {
            res.status(500).send({error: "authentication failed"});
        }
        let emp_id = req.body.emp_id;
        let password = req.body.password;
        
        let qr = `select * from registered_employee where emp_id = '${emp_id}' `; 
        await pool.query(qr,(err, result) =>{
            // console.log(result);
            if(err || result.rows.length==0 ){
                res.status(500).send({error: "login failed"});
            }
            else{
                const aFunction = async(password) => {
                    // ...
                    if(await bcrypt.compare(password, result.rows[0].password)) {
                        let resp = {
                            id : result.rows[0].emp_id,
                            user_name: result.rows[0].user_name
                        }
                        res.set('Content-Type', 'text/plain')
                        console.log("User authenticated")
        
                        let token = jwt.sign(resp,"secret", {expiresIn:1000}) // means valid for 60 seconds and second parameter is the secret code.
                        res.status(200).send({auth:true, token:token});
                    }
                    else{
                        res.status(500).send({error: "login failed"});
                    }
                }
                aFunction(password);
            }
        })
    }catch(err) {
        console.error(err.message);
    }
  
};

const view = async(req, res) => {
    try{
        const emp_id = req.body.emp_id;
        var qr = ` select hours, tts_code from logs where emp_id = '${emp_id}' `;
        
        await pool.query(qr, (err, result) => {
            if(err) {
                res.send({error: "Operation failed"});
            }
            else {
                if(result.rows.length == 0) {
                    res.send({error: "Invalid operation"});
                }
                else {
                    let totalHours = 0;
                    let unbilledHours = 0;
                    let billedHours = 0;
                    let length = result.rows.length;
                    for(var i=0; i< length; i++) {
                        if( String(result.rows[i].tts_code) == 'TRG'){
                            unbilledHours = unbilledHours + Number(result.rows[i].hours);
                        }
                        else {
                            billedHours = billedHours + Number(result.rows[i].hours);
                        }
                        totalHours = unbilledHours + billedHours;
                    }
                    console.log(unbilledHours, billedHours, totalHours); 

                    let resp = {
                        unbilledHours: unbilledHours,
                        billedHours: billedHours,
                        totalHours: totalHours
                    }

                    res.send(resp);// SENDS BUILD OR UNBUILD HOURS 
                }
            }
        })
    }catch(err){
        console.error(err.message);
    }
};

const register = async(req, res) => {
    try{
        const emp_id = req.body.emp_id;
        const user_name = req.body.user_name;
        const email = req.body.email;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const qr = ` insert into registered_employee(emp_id, user_name, email, password) values ('${emp_id}', '${user_name}', '${email}', '${hashedPassword}') `;
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
};


module.exports = {
    login,
    view,
    register
}