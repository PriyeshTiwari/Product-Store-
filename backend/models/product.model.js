import mongoose from "mongoose";

// Define the product schema

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,  
        required: true,
    },
    sellerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User", // Yeh User model se link karega
		required: true,
	},
}, {
    timestamps: true, //createdAt and updatedAt fields
});

const Product = mongoose.model('Product', productSchema);
//products

export default Product;