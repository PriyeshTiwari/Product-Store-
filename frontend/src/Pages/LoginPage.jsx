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
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../Store/useAuthStore";

const LoginPage = () => {
	const [inputs, setInputs] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(false); // For showing/hiding password
	const toast = useToast();
	const navigate = useNavigate();
	const { login } = useAuthStore(); // Zustand login action

	const handleLogin = async () => {
		if (!inputs.email || !inputs.password) {
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
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(inputs),
			});

			const data = await res.json();

			if (data.message) {
				toast({
					title: res.ok ? "Success" : "Error",
					description: data.message,
					status: res.ok ? "success" : "error",
					duration: 3000,
					isClosable: true,
				});
			}

			if (res.ok) {
				login(data); // Update auth state
				navigate("/"); // Redirect to home page
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
				<Heading>Login 🚪</Heading>
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

				<Button onClick={handleLogin} colorScheme='blue' w='full' isLoading={loading}>
					Login
				</Button>
				<Text>
					Don't have an account?{" "}
					<Link to='/signup' style={{ color: "#3182CE" }}>
						Sign Up
					</Link>
				</Text>
			</VStack>
		</Container>
	);
};

export default LoginPage;