import Cart from "../models/cart.model.js";

// User ka cart get karne ke liye
export const getCart = async (req, res) => {
	try {
		// populate() se humein product ki poori details mil jayengi
		const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
		if (!cart) {
			// Agar cart nahi hai, toh khali array bhejo
			return res.status(200).json({ items: [] });
		}
		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Cart mein item add karne ke liye
export const addToCart = async (req, res) => {
	const { productId, quantity } = req.body;
	const userId = req.user._id;

	try {
		let cart = await Cart.findOne({ userId });

		// Agar user ka cart nahi hai, toh ek naya banao
		if (!cart) {
			cart = new Cart({ userId, items: [] });
		}

		const itemIndex = cart.items.findIndex((p) => p.productId.equals(productId));

		if (itemIndex > -1) {
			// Agar product pehle se hai, toh quantity badhao
			cart.items[itemIndex].quantity += quantity;
		} else {
			// Agar nahi hai, toh naya item add karo
			cart.items.push({ productId, quantity });
		}

		await cart.save();
		const populatedCart = await cart.populate("items.productId");
		res.status(200).json(populatedCart);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Cart se item remove karne ke liye
export const removeFromCart = async (req, res) => {
	const { productId } = req.params;
	const userId = req.user._id;

	try {
		let cart = await Cart.findOne({ userId });
		if (!cart) {
			return res.status(404).json({ message: "Cart not found" });
		}

		cart.items = cart.items.filter((p) => !p.productId.equals(productId));

		await cart.save();
		const populatedCart = await cart.populate("items.productId");
		res.status(200).json(populatedCart);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};