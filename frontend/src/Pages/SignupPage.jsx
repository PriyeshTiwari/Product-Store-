import {
	Container,
	Heading,
	VStack,
	Input,
	Button,
	useToast,
	Text,
	InputGroup,
	InputRightElement,
	Checkbox, // 1. Checkbox ko Chakra UI se import karo
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../Store/useAuthStore";

const SignupPage = () => {
	const [inputs, setInputs] = useState({ name: "", email: "", password: "" });
	const [isSeller, setIsSeller] = useState(false); // 2. Checkbox ke liye state
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(false);
	const toast = useToast();
	const navigate = useNavigate();
	const { login } = useAuthStore();

	const handleSignup = async () => {
		if (!inputs.name || !inputs.email || !inputs.password) {
			toast({
				title: "Error",
				description: "Please fill all the fields",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				// 3. Backend ko role bhi bhejo, jo checkbox se decide hoga
				body: JSON.stringify({
					...inputs,
					role: isSeller ? "seller" : "customer",
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Signup failed");

			toast({
				title: "Success",
				description: "Account created successfully!",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			
			login(data); // User ko login karo

			// Agar user seller hai, toh use dashboard par bhejo
			if (data.role === "seller") {
				navigate("/seller-dashboard");
			} else {
				navigate("/"); // Varna home page par
			}
		} catch (error) {
			toast({
				title: "Error",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxW={"container.sm"} mt={12}>
			<VStack spacing={6}>
				<Heading>Sign Up 🚀</Heading>
				<Input
					placeholder='Full Name'
					value={inputs.name}
					onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
				/>
				<Input
					placeholder='Email'
					type='email'
					value={inputs.email}
					onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
				/>
				<InputGroup>
					<Input
						placeholder='Password'
						type={show ? "text" : "password"}
						value={inputs.password}
						onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
					/>
					<InputRightElement width='4.5rem'>
						<Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>

				{/* 4. Yahan par Checkbox UI mein add karo */}
				<Checkbox
					alignSelf={"flex-start"} // Form mein left side par dikhega
					isChecked={isSeller}
					onChange={(e) => setIsSeller(e.target.checked)}
				>
					Register as a Seller
				</Checkbox>

				<Button onClick={handleSignup} colorScheme='blue' w='full' isLoading={loading}>
					Sign Up
				</Button>
				<Text>
					Already have an account?{" "}
					<Link to='/login' style={{ color: "#3182CE" }}>
						Login
					</Link>
				</Text>
			</VStack>
		</Container>
	);
};

export default SignupPage;


// import {
// 	Container,
// 	Heading,
// 	VStack,
// 	Input,
// 	Button,
// 	useToast,
// 	Text,
// 	InputGroup,
// 	InputRightElement,
// } from "@chakra-ui/react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import useAuthStore from "../Store/useAuthStore";

// const SignupPage = () => {
// 	const [inputs, setInputs] = useState({ name: "", email: "", password: "" });
//     const [isSeller, setIsSeller] = useState(false); // Seller checkbox ke liye state
// 	const [loading, setLoading] = useState(false);
// 	const [show, setShow] = useState(false); // For showing/hiding password
// 	const toast = useToast();
// 	const navigate = useNavigate();
// 	const { login } = useAuthStore(); // Zustand login action

// 	const handleSignup = async () => {
// 		if (!inputs.name || !inputs.email || !inputs.password) {
// 			toast({
// 				title: "Error",
// 				description: "Please fill all the fields",
// 				status: "error",
// 				duration: 3000,
// 				isClosable: true,
// 			});
// 			return;
// 		}

// 		setLoading(true);
// 		try {
// 			const res = await fetch("/api/auth/signup", {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify(inputs),
// 			});

// 			const data = await res.json();

// 			if (data.message) {
// 				toast({
// 					title: res.ok ? "Success" : "Error",
// 					description: data.message,
// 					status: res.ok ? "success" : "error",
// 					duration: 3000,
// 					isClosable: true,
// 				});
// 			}

// 			if (res.ok) {
// 				login(data); // Update auth state
// 				navigate("/"); // Redirect to home page
// 			}
// 		} catch (error) {
// 			toast({
// 				title: "Error",
// 				description: error.message,
// 				status: "error",
// 				duration: 3000,
// 				isClosable: true,
// 			});
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<Container maxW={"container.sm"} mt={12}>
// 			<VStack spacing={6}>
// 				<Heading>Sign Up 🚀</Heading>
// 				<Input
// 					placeholder='Full Name'
// 					value={inputs.name}
// 					onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
// 				/>
// 				<Input
// 					placeholder='Email'
// 					type='email'
// 					value={inputs.email}
// 					onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
// 				/>
// 				<InputGroup>
// 					<Input
// 						placeholder='Password'
// 						type={show ? "text" : "password"}
// 						value={inputs.password}
// 						onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
// 					/>
// 					<InputRightElement width='4.5rem'>
// 						<Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
// 							{show ? "Hide" : "Show"}
// 						</Button>
// 					</InputRightElement>
// 				</InputGroup>

// 				<Button
// 					onClick={handleSignup}
// 					colorScheme='blue'
// 					w='full'
// 					isLoading={loading}
// 				>
// 					Sign Up
// 				</Button>
// 				<Text>
// 					Already have an account?{" "}
// 					<Link to='/login' style={{ color: "#3182CE" }}>
// 						Login
// 					</Link>
// 				</Text>
// 			</VStack>
// 		</Container>
// 	);
// };

// export default SignupPage;