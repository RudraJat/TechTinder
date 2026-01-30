const express = require("express");

const app = express();

//It'll understand and read json data that user send 
app.use(express.json());

//REQUEST HANDLER

//READING QUERY PARAMS IN THE ROUTES
// app.use("/user/:userId/:name",(req,res)=>{
//     console.log(req.params);//IT WILL READ THE DATA FROM URL AFTER /USER
// });

//This will only handle GET call to /user
// app.get("/user",(req,res)=>{
//     res.send({firstName: "Rudra", lastName:"Jat"});
// });

// app.post("/user",(req,res)=>{
//     console.log(req.body);//This prints the data sent by the user in the terminal.
//     //saving data to DB
//     res.send("Data successfully saved to the DB!");
// });

// app.delete("/user",(req,res)=>{
//     res.send("Deleted Successfully!");
// });

// //this will match all the HTTP method API calls to /test 
// app.use("/test",(req,res)=>{
//     res.send("hello from my server");
// })
// app.use("/home",(req,res)=>{
//     res.send("hello from dashboard");
// })


//ROUTE HANDDLER CHAINING
// app.use("/user",(req,res,next)=>{
//     // res.send("1st response");
//     console.log("This is response from first route handler");
//     next();
// },
//     (req,res)=>{
//         res.send("2nd response");
//         console.log("This is response from second route handler");
//     }
// )


//handle authorization middleware for all GET, POST, DELETE request to /user
// app.use("/user",(req,res,next)=>{
//     console.log("Authorization successful!");   
//     const token = "abac";
//     const isAuthorized = token === "abc";
//     if(!isAuthorized){
//         return res.status(401).send("Unauthorized User!");
//     } else{
//         next();
//     }
// });

// app.get("/user/getProfile",(req,res)=>{
//     res.send("user profile data");
// });

// app.get("/user/deleteProfile",(req,res)=>{
//     res.send("Deleted a profile");
// })

//Error handling middleware
app.get("/admin",(req,res)=>{
    // try{
        
    throw new Error("adkfadf");
    res.send("admin route");
    // }catch(err){
        //     res.status(500).send("Something went wrong in admin route!");
        // }
    });
    
    // always keep the sequence same i.e. err will come first then req, res, next
    app.use("/",(err,req,res,next)=>{
        res.status(500).send("Something went wrong! ");
    });
    
app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000...")
});