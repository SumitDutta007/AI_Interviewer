import express from "express"
import dotenv from "dotenv"
import {db} from "./config/db.js"
import resumeRouter from "./routes/resume.route.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 8002

app.use(express.json())

app.get("/", (req, res)=>{
    res.send("This is the resume route");
})

app.use("/", resumeRouter);

app.listen(PORT, async () => {
    console.log(`Resume service is running on port ${PORT}`);
    await db();

});