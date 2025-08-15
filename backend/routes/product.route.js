import express from "express";
import {
	createProduct,
	deleteProduct,
	getProducts,
	getSellerProducts,
	updateProduct,
} from "../controller/product.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", getProducts); // Sabke liye
router.get("/my-products", protectRoute, getSellerProducts); // Sirf logged-in seller ke liye

router.post("/", protectRoute, createProduct);
router.put("/:id", protectRoute, updateProduct);
router.delete("/:id", protectRoute, deleteProduct);

export default router;



// import express from "express";
// // import mongoose from 'mongoose';

// // import Product from '../models/product.model.js';
// import { createProduct, deleteProduct, getProducts, updateProduct } from "../controller/product.controller.js";
// import { protectRoute } from "../middleware/protectRoute.js"; // Import karo

// // const router = express.Router();

// // router.get('/', getProducts);

// // router.post('/', createProduct);

// // router.put('/:id', updateProduct);

// // router.delete('/:id',deleteProduct);
// const router = express.Router();

// router.get('/', getProducts);
// // Sirf logged in user hi create, update, delete kar sakta hai
// router.post('/', protectRoute, createProduct); 
// router.put('/:id', protectRoute, updateProduct);
// router.delete('/:id', protectRoute, deleteProduct);

// export default router;