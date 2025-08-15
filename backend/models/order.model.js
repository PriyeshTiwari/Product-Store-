import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
				quantity: { type: Number },
				price: { type: Number },
			},
		],
		totalAmount: {
			type: Number,
			required: true,
		},
		shippingAddress: {
			type: String,
			required: true,
		},
		orderStatus: {
			type: String,
			default: "Pending", // e.g., Pending, Shipped, Delivered
		},
	},
	{ timestamps: true }
); // Yeh order kab place hua, woh store karega

const Order = mongoose.model("Order", orderSchema);
export default Order;