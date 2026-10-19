import express from "express";
import { GoogleAuth } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", GoogleAuth);
authRouter.post("/logout", logout);

export default authRouter;

//.../api/v01/auth/login