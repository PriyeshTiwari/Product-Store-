import { Container, Heading, Button, SimpleGrid, Text, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../Components/ProductCard";

const SellerDashboard = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSellerProducts = async () => {
			try {
				const res = await fetch("/api/products/my-products");
				const data = await res.json();
				if (!res.ok) throw new Error(data.message);
				setProducts(data);
			} catch (error) {
				console.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchSellerProducts();
	}, []);

	if (loading) return <Spinner />;

	return (
		<Container maxW='container.lg'>
			<Heading mb={4}>My Products Dashboard</Heading>
			<Link to='/create'>
				<Button colorScheme='blue' mb={6}>Add New Product</Button>
			</Link>
			{products.length === 0 ? (
				<Text>You haven't added any products yet.</Text>
			) : (
				<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
					{products.map((product) => (
						// ProductCard ko 'seller' view ke saath use karenge
						<ProductCard key={product._id} product={product} view='seller' />
					))}
				</SimpleGrid>
			)}
		</Container>
	);
};

export default SellerDashboard;