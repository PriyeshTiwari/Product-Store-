import Product from "../models/product.model.js";
import mongoose from 'mongoose';

// Saare products get karne ke liye (Home Page ke liye)
export const getProducts = async (req, res) => {
	try {
		const products = await Product.find({}).populate("sellerId", "name"); // Seller ka naam bhi get kar rahe hain
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Sirf ek seller ke products get karne ke liye (Seller Dashboard ke liye)
export const getSellerProducts = async (req, res) => {
	try {
		const products = await Product.find({ sellerId: req.user._id });
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Naya product create karne ke liye (sirf seller kar sakta hai)
export const createProduct = async (req, res) => {
	// Rule: Sirf seller hi product bana sakta hai
	if (req.user.role !== "seller") {
		return res.status(403).json({ message: "Forbidden: Only sellers can add products" });
	}

	try {
		const { name, price, image } = req.body;
		const product = new Product({
			name,
			price,
			image,
			sellerId: req.user._id, // Logged-in seller ki ID save karo
		});
		await product.save();
		res.status(201).json(product);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// updateProduct function ko isse replace karo
export const updateProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ success: false, message: "Product not found" });
		}

		if (product.sellerId.toString() !== req.user._id.toString()) {
			return res.status(403).json({ success: false, message: "Forbidden: You don't own this product" });
		}

		const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
		// Frontend ke liye 'success' aur 'product' key ke saath response bhejo
		res.status(200).json({ success: true, product: updatedProduct });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// deleteProduct function ko isse replace karo
export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ success: false, message: "Product not found" });
		}

		if (product.sellerId.toString() !== req.user._id.toString()) {
			return res.status(403).json({ success: false, message: "Forbidden: You don't own this product" });
		}

		await Product.findByIdAndDelete(req.params.id);
		// Frontend ke liye 'success' key ke saath response bhejo
		res.status(200).json({ success: true, message: "Product deleted successfully" });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server error" });
	}
};


// import Product from "../models/product.model.js";
// import mongoose from 'mongoose';

// export const getProducts = async (req, res) => {
//     try {
//         const products = await Product.find({});
//         res.status(200).json({ success: true, products });

//     } catch (error) {
//         console.error("Error in fetching products:", error.message);
//         res.status(500).json({ success: false, message: 'Server Error' });
//     }
    
// };


// export const createProduct = async (req,res) => {
//     const product = req.body;
//     if (!product.name || !product.price || !product.image) {
//         return res.status(400).json({ message: 'Please fill all the fields' });
//     }

//     const newProduct = new Product(product);
//     try {
//         await newProduct.save();
//         res.status(201).json({success: true, product: newProduct});
//     } catch (error) {
//         console.error("Error in Create Product:",error.message);
//         res.status(500).json({ success: false, message: 'Server Error' });
//     }
// };

// export const updateProduct = async (req, res) => {
//     const { id } = req.params;
//     const product = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ success: false, message: 'Invalid Product ID' });
//     }

//     try {
//         const updatedProduct = await Product.findByIdAndUpdate(id,product, {new:true});
//         res.status(200).json({ success: true,data : updatedProduct });
//     } catch (error) {
//         res.status(500).json({success: false, message:"Server Error"})
//     }
// };

// export const deleteProduct = async (req, res) => {
//     const{id} = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ success: false, message: 'Invalid Product ID' });
//     }

//     try{
//         await Product.findByIdAndDelete(id);
//         res.status(200).json({ success: true, message: 'Product deleted successfully' });

//     } catch (error) {
//         console.log("Error in Delete Product:", error.message);
//         res.status(500).json({ success: false, message: 'Server Error' });
//     }
//     console.log("id:", id);
// };