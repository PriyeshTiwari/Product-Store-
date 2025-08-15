import {
	Container,
	Heading,
	VStack,
	HStack,
	Text,
	Button,
	Spinner,
	Image,
	Box,
	useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useCartStore from "../Store/useCartStore";

const CartPage = () => {
	const { items, loading, removeFromCart } = useCartStore();
	const toast = useToast();

	const handleRemove = async (productId, productName) => {
		await removeFromCart(productId);
		toast({
			title: "Removed",
			description: `${productName} removed from cart.`,
			status: "warning",
			duration: 2000,
			isClosable: true,
		});
	};

	const totalPrice = items.reduce(
		(sum, item) => sum + (item.productId?.price || 0) * item.quantity,
		0
	);

	if (loading) return <Spinner />;

	return (
		<Container maxW='container.lg'>
			<Heading mb={6}>Your Shopping Cart</Heading>
			{items.length === 0 ? (
				<Text>Your cart is empty. <Link to="/" style={{color:"cyan"}}>Go Shopping!</Link></Text>
			) : (
				<VStack spacing={4} align='stretch'>
					{items.map((item) => (
						<HStack key={item.productId?._id} p={4} shadow='md' borderWidth='1px' rounded='lg'>
							<Image
								boxSize='100px'
								objectFit='cover'
								src={item.productId?.image}
								alt={item.productId?.name}
							/>
							<Box flex='1'>
								<Text fontWeight='bold'>{item.productId?.name}</Text>
								<Text>Quantity: {item.quantity}</Text>
								<Text>Price: ₹{item.productId?.price.toLocaleString("en-IN")}</Text>
							</Box>
							<Button
								colorScheme='red'
								onClick={() => handleRemove(item.productId._id, item.productId.name)}
							>
								Remove
							</Button>
						</HStack>
					))}
					<HStack justify='space-between' mt={6}>
						<Heading size='lg'>Total: ₹{totalPrice.toLocaleString("en-IN")}</Heading>
						<Link to='/checkout'>
							<Button colorScheme='green' size='lg'>
								Proceed to Checkout
							</Button>
						</Link>
					</HStack>
				</VStack>
			)}
		</Container>
	);
};

export default CartPage;