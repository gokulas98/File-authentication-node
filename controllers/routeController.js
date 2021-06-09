const pool = require("../models/db");
const bcrypt= require('bcrypt');
const jwt = require("jsonwebtoken");
const path= require("path")

const login = async(req,res) => {
    try{
        console.log("Login function activated")
        console.log(req.body)
        if(req.body.emp_id==undefined || req.body.password==undefined) {
            res.status(500).send({error: "authentication failed! Credentials not defined"});
        }
        let emp_id = req.body.emp_id;
        let password = req.body.password;
        
        let qr = `select * from registered_employee where emp_id = '${emp_id}'`; 
        await pool.query(qr,(err, result) =>{
            console.table(result.rows[0])
            if(err || result.rows.length==0 ){
                res.status(500).send({error: "login failed"});
            }
            else{
                
                    // ...
                    bcrypt.compare(password, result.rows[0].password_digest, function(err, bcryptResult) {
                        if(bcryptResult==true) {
                            let resp = {
                                id : result.rows[0].emp_id,
                                user_name: result.rows[0].user_name
                            }
                            // res.set('Content-Type', 'text/plain')
                            console.log("User authenticateddddd")
            
                            let token = jwt.sign(resp,"secret", {expiresIn:600000})// means valid for 60 seconds and second parameter is the secret code.
                            // console.log("token:"+token)
                            res.cookie('jwt',token, { httpOnly: true , maxAge: 600000,sameSite: true })
                            res.redirect('/userhome')
                        }
                        else{
                            res.status(500).send({error: "login failed"});
                        }

                    });
                
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


const verifyCookieToken= async(req, res, next)=>{
    const token=req.cookies.jwt
    console.log("verifyCookieToken function activated")
    //let authHeader = req.headers.authorization;
    if(token==undefined) {
        //res.status(401).send({error:"no jwt token provided"}) // means there is no authHeader, and that means user is not having token. Thus he is unauthorized.
        res.redirect('/')
    }
    //let token = authHeader.split(" ")[1] // in authorization header, it will include bearer <token>, we need only token. So we split based on space and then choose the second substring.
    jwt.verify(token,"secret", function(err,decoded) {  // here we give the secret word, which we used while generating the token
        if(err) {
            res.status(500).send({error: "authentication failed"})
        }
        else {
            next();
        }
    }) 
}

const userHome= async(req,res)=>{
	console.log(req.cookies.jwt)
	res.sendFile(path.join(__dirname,'../views/userHome.html'))
}


module.exports = {
    login,
    view,
    register,
    verifyCookieToken,
    userHome
}