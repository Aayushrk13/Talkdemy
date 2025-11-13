import express from "express";
import http from "http";
import { initSocket } from "./socket/index.js";
import userrouter from "./routes/user.route.js";
import chatrouter from "./routes/chat.route.js";
import adminrouter from "./routes/admin.route.js"
import { connectDB } from "./db/index.js";
import cors from "cors";
import cookieparser from "cookie-parser";
import 'dotenv/config.js'
import path from "path";
const app = express()
const port = process.env.PORT;
connectDB()
const cors_option = {
	origin: "http://localhost:5173",
	credentials: true
}
//for encoding url
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(cors_option))
app.use(cookieparser())
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/v1/user", userrouter);
app.use("/api/v1/chat", chatrouter);

app.use("/api/v1/admin", adminrouter);


const server = http.createServer(app);
export const io = initSocket(server);

server.listen(port, () => {
	console.log(`Listeing on port :${port}`);
})
