import express from "express"
import dotenv from "dotenv"
import {db} from "./configs/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js"


dotenv.config()

const app = express()
const PORT = process.env.PORT || 8001

app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res)=>{
    res.send("This is the auth route");
})
app.use("/", authRouter);

const start = async () =>{
    try {
        await db();
        const server = app.listen(PORT, () => {
            console.log(`Auth service is running on port ${PORT}`);
        });
        server.on("error", (error) => {
            console.error("Auth service could not start:", error.message);
            process.exitCode = 1;
        });
    } catch (error) {
        console.error("Auth service could not connect to MongoDB.");
        console.error("Add this machine's IP address to the MongoDB Atlas Network Access allowlist.");
        console.error(error.message);
        process.exit(1);
    }
};

start();