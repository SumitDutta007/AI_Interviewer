import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import cookieParser from "cookie-parser"
import { getCurrentUser } from "./controllers/user.controller.js"
import { isAuth } from "./middleware/isAuth.js"

dotenv.config()
const app = express()
app.use(express.json())

const allowedOrigins = new Set([
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
].filter(Boolean))

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true)
        }

        return callback(new Error("Origin is not allowed by CORS"))
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(cookieParser())

const PORT = process.env.PORT || 8000

app.get("/", (req, res)=>{
    res.send("This is the gateway route");
})
app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL));
app.get("/api/me", (req, res, next) => {
    isAuth(req, res, next);
}, getCurrentUser);

app.listen(PORT, () => {
    console.log(`Gateway service is running on port ${PORT}`);
});