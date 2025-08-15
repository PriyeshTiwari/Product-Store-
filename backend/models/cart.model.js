import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product", // Yeh 'Product' model se link karega
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		min: 1,
	},
});

const cartSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User", // Yeh 'User' model se link karega
		required: true,
		unique: true,
	},
	items: [cartItemSchema],
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;