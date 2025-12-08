const express = require('express');
const connectDB = require('./config/database.js');

const app = express();

connectDB()
    .then(()=>{
        console.log("Database connected successfully!");
        app.listen(1111, () => {
            console.log("Server is listening on port 1111");    
        });
    })
    .catch((err)=>{
        console.log("Database connection failed!", err);
    });

    

