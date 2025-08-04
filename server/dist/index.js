import express from "express";
import userrouter from "./routes/login.route.js";
import { connect } from "mongoose";
const app = express();
const port = process.env.PORT || 8000;
connect("mongodb://127.0.0.1:27017/Talkdemy")
    .then(() => {
    console.log("DB is connected");
}).catch((err) => {
    console.log(`some error: ${err}`);
});
//for encoding url
app.use(express.urlencoded({ extended: false }));
app.use("/user", userrouter);
//# sourceMappingURL=index.js.map