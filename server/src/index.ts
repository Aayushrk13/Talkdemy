import express from "express";
import userrouter from "./routes/login.route.js";
import {connect} from "mongoose";
import 'dotenv/config.js'
const app = express()
const port = process.env.PORT ;
console.log(process.env.PORT);
connect(process.env.DB_CONNECTION||"Fail")
    .then(() => {
        console.log("DB is connected");
    }).catch((err) => {
        console.log(`some error: ${err}`);
    })
//for encoding url
app.use(express.urlencoded({extended:false}))

app.use("/user",userrouter);

app.listen(port,()=>{
    console.log(`Listeing on port :${port}`);
})
