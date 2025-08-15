import { Box, Button, Heading, Image, Text, useToast, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // useNavigate import karo
import useAuthStore from "../Store/useAuthStore";
import useCartStore from "../Store/useCartStore";
// Admin features ke liye imports (agar zaroorat ho)
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { useProductStore } from "../Store/product";

const ProductCard = ({ product, view = "customer" }) => {
	const { user } = useAuthStore();
	const { addToCart } = useCartStore();
	const { deleteProduct } = useProductStore();
	const navigate = useNavigate(); // navigate function nikalo
	const toast = useToast();

	const handleAddToCart = async () => {
		await addToCart(product._id);
		toast({ title: "Success", description: "Product added to cart.", status: "success" });
	};

	// NAYA FUNCTION: Buy Now ke liye
	const handleBuyNow = () => {
		// Checkout page par jaao aur product ki details state mein pass karo
		navigate("/checkout", { state: { productToBuy: product } });
	};

	const handleDelete = async () => {
		await deleteProduct(product._id);
		toast({ title: "Success", description: "Product deleted." });
	};

	return (
		<Box shadow='md' rounded='lg' overflow='hidden' bg='gray.700'>
			<Image src={product.image} alt={product.name} h={64} w='full' objectFit='cover' />
			<Box p={4}>
				<Heading as='h3' size='md' mb={2}>
					{product.name}
				</Heading>
				<Text fontWeight='bold' fontSize='xl' mb={4}>
					₹{product.price.toLocaleString("en-IN")}
				</Text>

				{user && (
					<HStack>
						{view === "customer" && user.role === "customer" && (
							<>
								<Button onClick={handleAddToCart} colorScheme='blue' flex='1'>
									Add to Cart
								</Button>
								<Button onClick={handleBuyNow} colorScheme='green' flex='1'>
									Buy Now
								</Button>
							</>
						)}
						{view === "seller" && user.role === "seller" && (
							<>
								<IconButton icon={<EditIcon />} aria-label='Edit Product' />
								<IconButton icon={<DeleteIcon />} colorScheme='red' aria-label='Delete Product' onClick={handleDelete} />
							</>
						)}
					</HStack>
				)}
			</Box>
		</Box>
	);
};

export default ProductCard;


// import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
// import {
// 	Box,
// 	Button,
// 	Heading,
// 	HStack,
// 	IconButton,
// 	Image,
// 	Input,
// 	Modal,
// 	ModalBody,
// 	ModalCloseButton,
// 	ModalContent,
// 	ModalFooter,
// 	ModalHeader,
// 	ModalOverlay,
// 	Text,
// 	useColorModeValue,
// 	useDisclosure,
// 	useToast,
// 	VStack,
// } from "@chakra-ui/react";
// import { useState } from "react";
// import { useProductStore } from "../Store/product";
// import useAuthStore from "../Store/useAuthStore";
// import useCartStore from "../Store/useCartStore"; // Cart store import karo

// const ProductCard = ({ product }) => {
// 	const [updatedProduct, setUpdatedProduct] = useState(product);
// 	const { user } = useAuthStore(); // User ka poora object nikalo
// 	const { deleteProduct, updateProduct } = useProductStore();
// 	const { addToCart } = useCartStore(); // addToCart function nikalo
	
// 	const { isOpen, onOpen, onClose } = useDisclosure();
// 	const toast = useToast();
// 	const bg = useColorModeValue("white", "gray.800");
// 	const textColor = useColorModeValue("gray.800", "white");

// 	const formattedPrice = product.price.toLocaleString("en-IN", {
// 		style: "currency",
// 		currency: "INR",
// 	});

// 	// Admin ke liye functions
// 	const handleDeleteProduct = async () => {
// 		await deleteProduct(product._id);
// 		toast({ title: "Success", description: "Product deleted.", status: "success" });
// 	};

// 	const handleUpdateProduct = async () => {
// 		await updateProduct(product._id, updatedProduct);
// 		onClose();
// 		toast({ title: "Success", description: "Product updated.", status: "success" });
// 	};

// 	// Customer ke liye function
// 	const handleAddToCart = async () => {
// 		await addToCart(product._id);
// 		toast({
// 			title: "Success!",
// 			description: `${product.name} has been added to your cart.`,
// 			status: "success",
// 			duration: 2000,
// 			isClosable: true,
// 			position: "top-right",
// 		});
// 	};

// 	return (
// 		<Box bg={bg} shadow='md' rounded='lg' overflow='hidden'>
// 			<Image src={product.image} alt={product.name} h={64} w='full' objectFit='cover' />
// 			<Box p={5}>
// 				<Heading as='h3' size='md' mb={2} color={textColor}>
// 					{product.name}
// 				</Heading>
// 				<Text fontWeight='bold' fontSize='xl' mb={4} color={textColor}>
// 					{formattedPrice}
// 				</Text>

// 				{/* YEH HAI MAIN LOGIC */}
// 				{user && (
// 					<Box mt={4}>
// 						{/* Agar user ADMIN hai, toh Edit/Delete buttons dikhao */}
// 						{user.role === 'admin' && (
// 							<HStack>
// 								<IconButton aria-label='Edit Product' icon={<EditIcon />} onClick={onOpen} />
// 								<IconButton
// 									aria-label='Delete Product'
// 									icon={<DeleteIcon />}
// 									colorScheme='red'
// 									onClick={handleDeleteProduct}
// 								/>
// 							</HStack>
// 						)}

// 						{/* Agar user ek normal USER hai, toh Add to Cart button dikhao */}
// 						{user.role === 'user' && (
// 							<Button onClick={handleAddToCart} colorScheme='blue' w='full'>
// 								Add to Cart
// 							</Button>
// 						)}
// 					</Box>
// 				)}
// 			</Box>

// 			{/* Update Modal (Yeh sirf admin ke liye kaam karega) */}
// 			<Modal isOpen={isOpen} onClose={onClose}>
// 				<ModalOverlay />
// 				<ModalContent>
// 					<ModalHeader>Update Product</ModalHeader>
// 					<ModalCloseButton />
// 					<ModalBody>
// 						<VStack spacing={4}>
// 							<Input
// 								value={updatedProduct.name}
// 								onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
// 							/>
// 							<Input
// 								type='number'
// 								value={updatedProduct.price}
// 								onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
// 							/>
// 							<Input
// 								value={updatedProduct.image}
// 								onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.value })}
// 							/>
// 						</VStack>
// 					</ModalBody>
// 					<ModalFooter>
// 						<Button colorScheme='blue' mr={3} onClick={handleUpdateProduct}>
// 							Update
// 						</Button>
// 						<Button variant='ghost' onClick={onClose}>
// 							Cancel
// 						</Button>
// 					</ModalFooter>
// 				</ModalContent>
// 			</Modal>
// 		</Box>
// 	);
// };

// export default ProductCard;

