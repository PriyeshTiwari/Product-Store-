import express from "express";
import { getCart, addToCart, removeFromCart } from "../controller/cart.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getCart);
router.post("/add", protectRoute, addToCart);
router.delete("/remove/:productId", protectRoute, removeFromCart);

export default router;