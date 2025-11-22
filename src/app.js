const express = require("express");

const app = express();

//request handler
app.use("/test",(req,res)=>{
    res.send("hello from my server");
})
app.use("/home",(req,res)=>{
    res.send("hello from dashboard");
})

app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000...")
});