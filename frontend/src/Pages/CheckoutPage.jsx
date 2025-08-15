import { Container, Heading, VStack, Input, Button, useToast, Text, Box, Image, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation import karo
import useCartStore from "../Store/useCartStore";

const CheckoutPage = () => {
	const [address, setAddress] = useState("");
	const [loading, setLoading] = useState(false);
	const { items: cartItems, clearCart } = useCartStore();
	const toast = useToast();
	const navigate = useNavigate();
	const location = useLocation(); // location se state nikalo

	// Check karo ki "Buy Now" se aaye hain ya "Cart" se
	const productToBuy = location.state?.productToBuy;
	const itemsToCheckout = productToBuy ? [{ productId: productToBuy, quantity: 1 }] : cartItems;
	const totalPrice = productToBuy
		? productToBuy.price
		: cartItems.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

	const handlePlaceOrder = async () => {
		if (!address) {
			return toast({ title: "Error", description: "Please enter a shipping address.", status: "error" });
		}
		if (itemsToCheckout.length === 0) {
			return toast({ title: "Error", description: "No items to checkout.", status: "error" });
		}

		setLoading(true);
		try {
			// Agar 'Buy Now' hai toh product ki detail body mein bhejo
			const requestBody = {
				shippingAddress: address,
				...(productToBuy && {
					product: { productId: productToBuy._id, quantity: 1 },
				}),
			};

			const res = await fetch("/api/orders/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			toast({ title: "Order Placed!", status: "success" });
			// Agar cart se checkout kiya hai toh cart clear karo
			if (!productToBuy) {
				clearCart();
			}
			navigate("/");
		} catch (error) {
			toast({ title: "Error", description: error.message, status: "error" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxW='container.md'>
			<VStack spacing={6} mt={12}>
				<Heading>Checkout</Heading>
				<Box w='full'>
					<Heading size='md' mb={4}>Order Summary</Heading>
					{itemsToCheckout.map(item => (
						<HStack key={item.productId._id} justify='space-between' w='full'>
							<Text>{item.productId.name} x {item.quantity}</Text>
							<Text>₹{(item.productId.price * item.quantity).toLocaleString("en-IN")}</Text>
						</HStack>
					))}
					<HStack justify='space-between' w='full' mt={4} pt={4} borderTopWidth='1px'>
						<Text fontWeight='bold' fontSize='lg'>Total</Text>
						<Text fontWeight='bold' fontSize='lg'>₹{totalPrice.toLocaleString("en-IN")}</Text>
					</HStack>
				</Box>
				<Input
					placeholder='Enter your full shipping address'
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					size='lg'
				/>
				<Button colorScheme='green' size='lg' w='full' isLoading={loading} onClick={handlePlaceOrder}>
					Place Order (Cash on Delivery)
				</Button>
			</VStack>
		</Container>
	);
};

export default CheckoutPage;