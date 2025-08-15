import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function to generate token
const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    });

    res.cookie("jwt", token, {
        httpOnly: true, // Prevents XSS attacks
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        sameSite: "strict", // Prevents CSRF attacks
    });
};


export const signup = async (req, res) => {
	try {
		// STEP 1: Yahan par 'role' ko req.body se nikalna zaroori hai
		const { name, email, password, role } = req.body;

		// Check if user already exists
		const user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ message: "User already exists" });
		}

		// STEP 2: Naya user banate time 'role' ko yahan pass karna zaroori hai
		const newUser = new User({
			name,
			email,
			password,
			role, // Agar yeh line miss hogi, toh default 'customer' save ho jayega
		});

		await newUser.save(); // Database mein user save hoga

		// Agar user save ho gaya hai, toh token generate karo aur response bhejo
		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			res.status(201).json({
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				role: newUser.role, // Response mein bhi role bhejo
			});
		} else {
			res.status(400).json({ message: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}