import express from "express";
import { verifyToken } from "../middleware/verify.js";
import { bookTicket, getUserTicket } from "../controllers/ticket.js";
const router = express.Router();

router.get("/book", verifyToken, bookTicket);
router.post("/myTicket", verifyToken, getUserTicket);

export default router;
