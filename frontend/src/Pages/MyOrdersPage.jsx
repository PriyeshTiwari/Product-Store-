import {
	Container,
	Heading,
	VStack,
	Text,
	Spinner,
	Box,
	HStack,
	Image,
	Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyOrdersPage = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await fetch("/api/orders/my-orders");
				const data = await res.json();
				if (!res.ok) throw new Error(data.message);
				setOrders(data);
			} catch (error) {
				console.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, []);

	if (loading) {
		return (
			<Container centerContent>
				<Spinner size='xl' mt={20} />
			</Container>
		);
	}

	return (
		<Container maxW='container.lg'>
			<Heading mb={6}>My Orders</Heading>
			{orders.length === 0 ? (
				<Text>You haven't placed any orders yet. <Link to="/" style={{color:"cyan"}}>Start Shopping!</Link></Text>
			) : (
				<VStack spacing={6} align='stretch'>
					{orders.map((order) => (
						<Box key={order._id} p={5} shadow='md' borderWidth='1px' rounded='lg'>
							<HStack justify='space-between' mb={4}>
								<Text fontSize='sm' color='gray.500'>
									Order ID: {order._id}
								</Text>
								<Text fontSize='sm' color='gray.500'>
									Placed on: {new Date(order.createdAt).toLocaleDateString()}
								</Text>
							</HStack>
							<VStack align='stretch' spacing={4}>
								{order.products.map((item) => (
									<HStack key={item.productId._id}>
										<Image
											boxSize='50px'
											objectFit='cover'
											src={item.productId.image}
											alt={item.productId.name}
										/>
										<Box flex='1'>
											<Text fontWeight='bold'>{item.productId.name}</Text>
											<Text fontSize='sm'>
												{item.quantity} x ₹{item.price.toLocaleString("en-IN")}
											</Text>
										</Box>
									</HStack>
								))}
							</VStack>
							<HStack justify='space-between' mt={4} pt={4} borderTopWidth='1px'>
								<Badge colorScheme='green'>{order.orderStatus}</Badge>
								<Text fontWeight='bold' fontSize='lg'>
									Total: ₹{order.totalAmount.toLocaleString("en-IN")}
								</Text>
							</HStack>
						</Box>
					))}
				</VStack>
			)}
		</Container>
	);
};

export default MyOrdersPage;