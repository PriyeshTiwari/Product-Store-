import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js"; // Product model import karo

export const createOrder = async (req, res) => {
	try {
		const userId = req.user._id;
		const { shippingAddress, product: singleProduct } = req.body; // 'product' ko body se nikalo

		let orderProducts, totalAmount;

		// YEH HAI NAYA LOGIC
		// Agar frontend se ek single product aa raha hai (Buy Now)
		if (singleProduct) {
			const product = await Product.findById(singleProduct.productId);
			if (!product) {
				return res.status(404).json({ message: "Product not found" });
			}
			totalAmount = product.price * singleProduct.quantity;
			orderProducts = [
				{
					productId: product._id,
					quantity: singleProduct.quantity,
					price: product.price,
				},
			];
		} else {
			// Purana logic: Cart se checkout
			const cart = await Cart.findOne({ userId }).populate("items.productId");
			if (!cart || cart.items.length === 0) {
				return res.status(400).json({ message: "Your cart is empty" });
			}
			totalAmount = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
			orderProducts = cart.items.map((item) => ({
				productId: item.productId._id,
				quantity: item.quantity,
				price: item.productId.price,
			}));

            // Order place hone ke baad cart ko khali kar do
            cart.items = [];
		    await cart.save();
		}

		// Naya order create karo
		const order = new Order({
			userId,
			products: orderProducts,
			totalAmount,
			shippingAddress,
		});
		await order.save();

		res.status(201).json(order);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ userId: userId })
            .populate("products.productId", "name image") // Product ka naam aur image bhi fetch karlo
            .sort({ createdAt: -1 }); // Sabse naya order sabse upar

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// import Order from "../models/order.model.js";
// import Cart from "../models/cart.model.js";

// export const createOrder = async (req, res) => {
// 	try {
// 		const userId = req.user._id;
// 		const { shippingAddress } = req.body;

// 		const cart = await Cart.findOne({ userId }).populate("items.productId");

// 		if (!cart || cart.items.length === 0) {
// 			return res.status(400).json({ message: "Your cart is empty" });
// 		}

// 		const totalAmount = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

// 		const order = new Order({
// 			userId,
// 			products: cart.items.map((item) => ({
// 				productId: item.productId._id,
// 				quantity: item.quantity,
// 				price: item.productId.price,
// 			})),
// 			totalAmount,
// 			shippingAddress,
// 		});

// 		await order.save();

// 		// Order place hone ke baad cart ko khali kar do
// 		cart.items = [];
// 		await cart.save();

// 		res.status(201).json(order);
// 	} catch (error) {
// 		res.status(500).json({ message: "Server error", error: error.message });
// 	}
// };