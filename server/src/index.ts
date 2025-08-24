import express from "express";
import http from "http";
import { initSocket } from "./socket/index.js";
import userrouter from "./routes/user.route.js";
import chatrouter from "./routes/chat.route.js";
import {connectDB} from "./db/index.js";
import cors from "cors";
import cookieparser from "cookie-parser";
import 'dotenv/config.js'
const app = express()
const port = process.env.PORT ;
connectDB()
const cors_option = {
    origin:"http://localhost:5173",
    credentials: true
}
//for encoding url
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors(cors_option))
app.use(cookieparser())


app.use("/user",userrouter);
app.use("/chat",chatrouter);


const server = http.createServer(app);
initSocket(server);

server.listen(port,()=>{
    console.log(`Listeing on port :${port}`);
})
