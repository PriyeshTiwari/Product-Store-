import express from "express";
import { createOrder, getMyOrders} from "../controller/order.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create", protectRoute, createOrder);
router.get("/my-orders", protectRoute, getMyOrders);

export default router;