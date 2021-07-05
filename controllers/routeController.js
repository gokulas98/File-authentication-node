const pool = require("../models/db");
const bcrypt= require('bcrypt');
const jwt = require("jsonwebtoken");
const path= require("path");
// const { json } = require("body-parser");

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
                            res.cookie("EmpID" , emp_id,{ httpOnly: true , maxAge: 600000,sameSite: true });
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
        console.log(req.body)
        console.log("COOKIE VALUE: "+req.cookies.EmpID)
        const emp_id = req.cookies.EmpID;

        const role_query= `select role from registered_employee where emp_id= '${emp_id}' `;
        const role_details= await pool.query(role_query)
        console.log(role_details.rows[0].role)
        if(role_details.rows[0].role=="Super admin"){


            
        var qr = ` select emp_id, hours, tts_code from logs `;
        
        await pool.query(qr, (err, result) => {
            if(err) {
                res.send({error: "Operation failed"});
            }
            else {
                if(result.rows.length == 0) {
                    res.send({error: "Invalid operation"});
                }
                else {
                    function effortCalculator(result){
                    console.log(result)
                    let totalHours = 0;
                    let unbilledHours = 0;
                    let billedHours = 0;
                    
                        if( String(result.tts_code) == 'TRG'){
                            unbilledHours = unbilledHours + Number(result.hours);
                        }
                        else {
                            billedHours = billedHours + Number(result.hours);
                        }
                        totalHours = unbilledHours + billedHours;
                    console.log(unbilledHours, billedHours, totalHours); 
                    let employee_id=result.emp_id

                    let obj = {
                        employee_id:employee_id,
                        unbilledHours: unbilledHours,
                        billedHours: billedHours,
                        totalHours: totalHours
                    }

                    return obj
                    }

                    // resp=result.rows.forEach(effortCalculator)
                    let resp=[]
                    for (i = 0; i < result.rows.length; i++) {
                        let emp_data=effortCalculator(result.rows[i]);
                        resp.push(emp_data)
                      } 
                    // console.log(JSON.stringify(resp))
                    

                    res.status(200).send(JSON.stringify(resp));// SENDS BUILD OR UNBUILD HOURS 
                }
            }
        })



        }

        else{
        var qr = ` select emp_id, hours, tts_code from logs where emp_id = '${emp_id}' `;
        
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
                    let employee_id=result.rows[0].emp_id

                    let obj = {employee_id:employee_id,
                        unbilledHours: unbilledHours,
                        billedHours: billedHours,
                        totalHours: totalHours
                    }
                    let resp=[]
                    resp.push(obj)

                    res.status(200).send(resp);// SENDS BUILD OR UNBUILD HOURS 
                }
            }
        })
    }
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
            console.log('Token verification success')
            next();
        }
    }) 
}

const userHome= async(req,res)=>{
    const emp_id = req.cookies.EmpID;
    const role_query= `select role from registered_employee where emp_id= '${emp_id}' `;
    const role_details= await pool.query(role_query)
    console.log(role_details.rows[0].role)
    if(role_details.rows[0].role=="Super admin"){

        res.sendFile(path.join(__dirname,'../views/welcomeSuperAdmin.html'))
    }
    else{
        res.sendFile(path.join(__dirname,'../views/welcome.html'))
    }
}


// const superadmin=async(req,res)=>{
//     res.sendFile(path.join(__dirname,'../views/welcomeSuperAdmin.html'))
// }



// async function authRole(role){ return (req,res,next)=>{
//     const emp_id = req.cookies.EmpID;
//     const role_query= `select role from registered_employee where emp_id= '${emp_id}' `;
//     const role_details= await pool.query(role_query)
//     console.log(role_details.rows[0].role)
//     if(role_details.rows[0].role !==role){
//         res.status(401)
//         return res.send("Not allowed")

//     }
//     else{
//         next()
//     }
// }
// }


module.exports = {
    login,
    view,
    register,
    verifyCookieToken,
    userHome
}