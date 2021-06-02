// File : index.js

const express = require("express");
// const bodyParser = require("body-parser");


const app = express();

// PORT
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});



var authn=false;                  //dummy variable

app.get("/authn", (req,res)=> {


  console.log(req.body)
  if(authn==true){
    res.set('Content-Type', 'text/plain')
    res.status(200).send('Successfully logged in')
    console.log("User authenicated")
  }
  else{
    res.status(401).send('Wrong credentials')
    console.log("User not authenticated")

  }
})



app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
