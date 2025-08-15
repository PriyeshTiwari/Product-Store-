import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import CreatePage from "./Pages/CreatePage";
import Navbar from "./Components/Navbar";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import CartPage from "./Pages/CartPage"; // YEH LINE MISSING THI
import CheckoutPage from "./Pages/CheckoutPage";
import SellerDashboard from "./Pages/SellerDashboard";
import useAuthStore from "./Store/useAuthStore";
import MyOrdersPage from "./Pages/MyOrdersPage"; 

function App() {
	const { user } = useAuthStore();

	return (
		<Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
			<Navbar />
			<Routes>
				{/* Public Routes */}
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={!user ? <SignupPage /> : <Navigate to='/' />} />
				<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />

				{/* Protected Routes */}
				<Route path='/create' element={user?.role === "seller" ? <CreatePage /> : <Navigate to='/login' />} />
				<Route path='/cart' element={user?.role === "customer" ? <CartPage /> : <Navigate to='/login' />} />
				<Route path='/checkout' element={user?.role === "customer" ? <CheckoutPage /> : <Navigate to='/login' />} />
        <Route path='/my-orders' element={user?.role === "customer" ? <MyOrdersPage /> : <Navigate to='/login' />} />
				<Route
					path='/seller-dashboard'
					element={user?.role === "seller" ? <SellerDashboard /> : <Navigate to='/' />}
				/>
			</Routes>
		</Box>
	);
}

export default App;


// import { Box, useColorModeValue} from "@chakra-ui/react";
// import { Route, Routes, Navigate } from "react-router-dom"; 
// import HomePage from "./Pages/HomePage";
// import CreatePage from "./Pages/CreatePage";
// import Navbar from "./Components/Navbar";
// import SignupPage from "./Pages/SignupPage"; // Import
// import LoginPage from "./Pages/LoginPage";   // Import
// import SellerDashboard from "./Pages/SellerDashboard"; 
// import useAuthStore from "./Store/useAuthStore";

// function App() {
//   const { user } = useAuthStore();


//   return (
//     <Box minH={"100vh"} bg={useColorModeValue("gray.300", "gray.900")}>
//       <Navbar/>
//       	<Routes>
//           {/* Public Routes */ }
//           <Route path='/' element={<HomePage />} />
//           <Route path='/signup' element={!user ? <SignupPage /> : <Navigate to='/' />} />
//           <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />

//           {/* Protected Routes */}
//           <Route path='/create' element={user?.role === "seller" ? <CreatePage /> : <Navigate to='/login' />} />
//           <Route path='/cart' element={user?.role === "customer" ? <CartPage /> : <Navigate to='/login' />} />
//           <Route path='/checkout' element={user?.role === "customer" ? <CheckoutPage /> : <Navigate to='/login' />} />
//           <Route
//             path='/seller-dashboard'
//             element={user?.role === "seller" ? <SellerDashboard /> : <Navigate to='/' />}
//           />
// 			  </Routes>
//       {/* <Routes>
//         <Route path="/" element= {<HomePage/>} />
//         <Route path="/create" element={<CreatePage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path='/seller-dashboard' element={user?.role === "seller" ? <SellerDashboard /> : <Navigate to='/' />} />

//       </Routes> */}
//     </Box>
//   )
// }

// export default App
