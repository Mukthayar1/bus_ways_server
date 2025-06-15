import express from "express";
import { loginOrSignupUser, getRefreshToken } from "../controllers/user.js";

const router = express.Router();

router.post("/login", loginOrSignupUser);
router.post("/refreshToken", getRefreshToken);

export default router;
