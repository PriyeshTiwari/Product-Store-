import { Container, SimpleGrid, Text, VStack, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../Store/product"; // Confirm the path is correct
import ProductCard from "../Components/ProductCard";
import useAuthStore from "../Store/useAuthStore";

const HomePage = () => {
	// Product store se products, loading state, aur fetch function nikalo
	const { products, loading, fetchProducts } = useProductStore();
	const { user } = useAuthStore();

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]); // fetchProducts ko dependency array mein daalna aachi practice hai

	// 1. Loading state handle karo
	if (loading) {
		return (
			<Container centerContent>
				<Spinner size='xl' mt={20} />
			</Container>
		);
	}

	return (
		<Container maxW='container.xl' py={12}>
			<VStack spacing={8}>
				<Text
					fontSize='3xl'
					fontWeight='bold'
					bgGradient='linear(to-r, cyan.400, blue.500)'
					bgClip='text'
					textAlign='center'
				>
					Current Products 🚀
				</Text>

				<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w='full'>
					{/* 2. Safety Check: Map chalane se pehle check karo ki products exist karte hain */}
					{(products || []).map((product) => (
						// product object ko bhi check kar lo
						product && <ProductCard key={product._id} product={product} view='customer' />
					))}
				</SimpleGrid>

				{/* Agar products nahi hain, toh message dikhao */}
				{!loading && products.length === 0 && (
					<Text fontSize='xl' textAlign='center' fontWeight='bold' color='gray.500'>
						No products found 😢{" "}
						{user?.role === "seller" && (
							<Link to='/create'>
								<Text as='span' color='blue.500' _hover={{ textDecoration: "underline" }}>
									Create a product
								</Text>
							</Link>
						)}
					</Text>
				)}
			</VStack>
		</Container>
	);
};

export default HomePage;


// import { Container, SimpleGrid, Text, VStack } from "@chakra-ui/react";
// import { useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useProductStore } from "../Store/product";
// import ProductCard from "../Components/ProductCard";

// const HomePage = () => {
//   const { fetchProducts, products } = useProductStore();

//   useEffect(() => {
//     fetchProducts();
//   }, []); // Empty array, taaki sirf ek baar chale

//   console.log("products", products);

//   return (
//     <Container maxW="container.xl" py={12}>
//       <VStack spacing={8}>
//         <Text
//           fontSize="30"
//           fontWeight="bold"
//           bgGradient="linear(to-r, cyan.400, blue.500)"
//           bgClip="text"
//           textAlign="center"
//         >
//           Current Products 🚀
//         </Text>

//         <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w="full">
//           {(products || []).map((product) => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </SimpleGrid>

//         {!products || products.length === 0 ? (
//           <Text fontSize="xl" textAlign="center" fontWeight="bold" color="gray.500">
//             No products found 😢{" "}
//             <Link to="/create">
//               <Text as="span" color="blue.500" _hover={{ textDecoration: "underline" }}>
//                 Create a product
//               </Text>
//             </Link>
//           </Text>
//         ) : null}
//       </VStack>
//     </Container>
//   );
// };

// export default HomePage;
