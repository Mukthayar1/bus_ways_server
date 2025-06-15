import express from "express";
import { getBusDetail, searchBus } from "../controllers/bus.js";
import { verifyToken } from "../middleware/verify.js";
const router = express.Router();

router.get("/getBusDetail/:busId", verifyToken, getBusDetail);
router.post("./searchBus", verifyToken, searchBus);

export default router;
