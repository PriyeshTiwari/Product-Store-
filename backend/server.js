import express from 'express';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from 'path';

// Database connection function
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from "./routes/auth.route.js";
import productRoutes from './routes/product.route.js';
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware
app.use(express.json()); // JSON body parser (sirf ek baar zaroori hai)
app.use(cookieParser()); // Cookie parser

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ================== PRODUCTION DEPLOYMENT LOGIC ==================
if (process.env.NODE_ENV === "production") {
    // 1. Frontend ki build files ko serve karo
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    // 2. Baaki saari requests ko frontend ke index.html par bhej do
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}
// =================================================================

// Function to start the server after connecting to DB
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Agar DB connect na ho, toh server band kar do
    }
};

startServer();

// import express from 'express';
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser"; // Import karo
// import { connectDB } from './config/db.js';
// import authRoutes from "./routes/auth.route.js"; // Import karo
// import path from 'path';
// import productRoutes from './routes/product.route.js';
// import cartRoutes from "./routes/cart.route.js";
// import orderRoutes from "./routes/order.route.js";

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cookieParser());
// const PORT = process.env.PORT || 5000;
// const __dirname = path.resolve();

// app.use(express.json());
// app.use("/api/auth", authRoutes); // Yahan use karo
// app.use("/api/products", productRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/orders", orderRoutes);

// if (process.env.NODE_ENV === "production") {
//   // Yeh code Express ko batayega ki frontend ki build files kahan hain
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   // *ALL* non-API routes ko React app serve kare
//   // API routes ke alawa koi bhi aur request frontend ki index.html file ko bhej degi
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend","dist","index.html"));
//     // res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
//   });
// } else {
//   // Dev mode ke liye API test route dikhana sahi hai
//   app.get("/", (req, res) => {
//     res.send("API is running.");
//   });
// }

// // app.get("/", (req, res) => {
// //   res.send("API is running.");
// // });

// // if (process.env.NODE_ENV === "production") {
// //   app.use(express.static(path.join(__dirname, "../frontend/dist")));
// //   app.get("*", (req, res) => {
// //     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
// //   });
// // }

// // Recommended: Single place for DB connect and server start
// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error('Failed to connect to MongoDB:', err);
//     process.exit(1);
//   }
// };

// startServer();



