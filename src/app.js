const express = require("express");

const app = express();

//It'll understand and read json data that user send 
app.use(express.json());

//request handler

//This will only handle GET call to /user
app.get("/user",(req,res)=>{
    res.send({firstName: "Rudra", lastName:"Jat"});
});

app.post("/user",(req,res)=>{
    console.log(req.body);//This prints the data sent by the user in the terminal.
    //saving data to DB
    res.send("Data successfully saved to the DB!");
});

app.delete("/user",(req,res)=>{
    res.send("Deleted Successfully!");
});

//this will match all the HTTP method API calls to /test 
app.use("/test",(req,res)=>{
    res.send("hello from my server");
})
app.use("/home",(req,res)=>{
    res.send("hello from dashboard");
})

app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000...")
});