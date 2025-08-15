import { Button, Container, HStack, Flex, Text, useColorMode, useToast } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusSquareIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { FaShoppingCart } from "react-icons/fa";
import { useEffect } from 'react';

import useAuthStore from '../Store/useAuthStore';
import useCartStore from '../Store/useCartStore';

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { user, logout } = useAuthStore();
    const { items, fetchCart, clearCart } = useCartStore();
    const toast = useToast();
    const navigate = useNavigate();

    // Jab user login ho, toh uska cart fetch karo
    useEffect(() => {
        if (user?.role === 'customer') {
            fetchCart();
        }
    }, [user, fetchCart]);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            logout();
            clearCart();
            navigate("/login");
            toast({
                title: "Success",
                description: "Logged out successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW={"1140px"} px={4} py={2} mb={4}>
            <Flex
                h={16}
                alignItems={'center'}
                justifyContent={'space-between'}
            >
                <Text
                    fontSize={{ base: "22", sm: "28" }}
                    fontWeight={"bold"}
                    bgGradient={"linear(to-r, cyan.400, blue.500)"}
                    bgClip={"text"}
                >
                    <Link to={"/"}>Product Store 🛒</Link>
                </Text>

                <HStack spacing={3} alignItems={"center"}>
                    {user ? (
                        <>
                            {/* Agar user SELLER hai */}
                            {user?.role === 'seller' && (
                                <>
                                    <Link to="/seller-dashboard">
                                        <Button size={"sm"}>My Dashboard</Button>
                                    </Link>
                                    <Link to="/create">
                                        <Button size={"sm"}>
                                            <PlusSquareIcon fontSize={20} />
                                        </Button>
                                    </Link>
                                </>
                            )}

                            {/* Agar user CUSTOMER hai */}
                            {user?.role === 'customer' && (
                                <>
                                    {/* YEH NAYA LINK ADD KIYA HAI */}
                                    <Link to="/my-orders">
                                        <Button size={"sm"}>My Orders</Button>
                                    </Link>
                                    <Link to="/cart">
                                        <Button size={"sm"} position="relative">
                                            <FaShoppingCart />
                                            {items.length > 0 && (
                                                <Text
                                                    as="span"
                                                    position="absolute"
                                                    top="-8px"
                                                    right="-8px"
                                                    bg="red.500"
                                                    color="white"
                                                    borderRadius="full"
                                                    px={2}
                                                    fontSize="xs"
                                                >
                                                    {items.length}
                                                </Text>
                                            )}
                                        </Button>
                                    </Link>
                                </>
                            )}

                            <Button size={"sm"} onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button size={"sm"}>Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button size={"sm"}>Sign Up</Button>
                            </Link>
                        </>
                    )}

                    <Button size={"sm"} onClick={toggleColorMode}>
                        {colorMode === 'light' ? <IoMoon /> : <LuSun size='20' />}
                    </Button>
                </HStack>
            </Flex>
        </Container>
    );
};

export default Navbar;






// import { Button, Container, HStack, Flex, Text, useColorMode, useToast } from '@chakra-ui/react';
// import { Link, useNavigate } from 'react-router-dom';
// import { PlusSquareIcon } from "@chakra-ui/icons";
// import { IoMoon } from "react-icons/io5";
// import { LuSun } from "react-icons/lu";
// import useAuthStore from '../Store/useAuthStore'; // 1. Store ko import karo

// const Navbar = () => {
//     const { colorMode, toggleColorMode } = useColorMode();
//     const { user, logout } = useAuthStore(); // 2. User ki state aur logout function nikalo
//     const toast = useToast();
//     const navigate = useNavigate();

//     // 3. Logout ka logic handle karne ke liye function
//     const handleLogout = async () => {
//         try {
//             // Backend se logout request bhejo (cookie clear karne ke liye)
//             const res = await fetch("/api/auth/logout", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//             });
//             const data = await res.json();
//             
//             if(!res.ok) throw new Error(data.message);

//             // Frontend se user state clear karo
//             logout();
//             navigate("/login"); // User ko login page par bhej do
//             toast({
//                 title: "Success",
//                 description: "Logged out successfully",
//                 status: "success",
//                 duration: 3000,
//                 isClosable: true,
//             });
//         } catch (error) {
//             toast({
//                 title: "Error",
//                 description: error.message,
//                 status: "error",
//                 duration: 3000,
//                 isClosable: true,
//             });
//         }
//     };

//     return (
//         <Container maxW={"1140px"} px={4}>
//             <Flex
//                 h={16}
//                 alignItems={'center'}
//                 justifyContent={'space-between'}
//                 flexDir={{ base: 'column', sm: 'row' }}
//             >
//                 <Text
//                     fontSize={{ base: "22", sm: "28" }}
//                     fontWeight={"bold"}
//                     textTransform={"uppercase"}
//                     textAlign={"center"}
//                     bgGradient={"linear(to-r, cyan.400, blue.500)"}
//                     bgClip={"text"}
//                 >
//                     <Link to={"/"}>Product Store 🛒</Link>
//                 </Text>

//                 <HStack spacing={2} alignItems={"center"}>
//                     {/* 4. Conditional Rendering: Check karo agar user hai ya nahi */}
//                     {user ? (
//                         <>
//                             <Link to="/create">
//                                 <Button size={"sm"}>
//                                     <PlusSquareIcon fontSize={20} />
//                                 </Button>
//                             </Link>
//                             <Button size={"sm"} onClick={handleLogout}>
//                                 Logout
//                             </Button>
//                         </>
//                     ) : (
//                         <>
//                             <Link to="/login">
//                                 <Button size={"sm"}>Login</Button>
//                             </Link>
//                             <Link to="/signup">
//                                 <Button size={"sm"}>Sign Up</Button>
//                             </Link>
//                         </>
//                     )}

//                     <Button size={"sm"} onClick={toggleColorMode}>
//                         {colorMode === 'light' ? <IoMoon /> : <LuSun size='20' />}
//                     </Button>
//                 </HStack>
//             </Flex>
//         </Container>
//     );
// };

// export default Navbar;