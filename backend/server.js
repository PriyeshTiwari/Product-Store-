import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import path from 'path';
import productRoutes from './routes/product.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json());
app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // *ALL* non-API routes ko React app serve kare
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend","dist","index.html"));
    // res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
  });
} else {
  // Dev mode ke liye API test route dikhana sahi hai
  app.get("/", (req, res) => {
    res.send("API is running.");
  });
}

// app.get("/", (req, res) => {
//   res.send("API is running.");
// });

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
//   });
// }

// Recommended: Single place for DB connect and server start
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};

startServer();



// // const express = require('express');
// import express from 'express';
// import dotenv from "dotenv";
// dotenv.config();
// import { connectDB } from './config/db.js';
// import path from 'path';

// import productRoutes from './routes/product.route.js';
// // import Product from './models/product.model.js'; 
// // import mongoose from 'mongoose';

// const app = express();
// const PORT = process.env.PORT || 5000 ;

// const __dirname = path.resolve(); // Get the current directory name

// app.use(express.json()); // allow us to accept JSON data in the req.body

// app.use("/api/products",productRoutes)

// // Add this for root ('/') endpoint
// app.get("/", (req, res) => {
//     res.send("API is running.");
// });


// const startServer = async () => {
//     try {
//         await connectDB();
//         console.log('Connected to MongoDB');
//         app.listen(PORT, () => {
//             console.log('Server is started at http://localhost:' + PORT);
//         });
//     } catch (error) {
//         console.error('Failed to connect MongoDB:', error);
//         process.exit(1); // Stops the process if DB didn't connect
//     }
// };

// startServer();
// if (process.env.NODE_ENV === "production"){
//     app.use(express.static(path.join(__dirname,"/frontend/dist")));
//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
//     })
// }

// app.listen(5000, () => {
//     connectDB();
//     console.log('Connected to MongoDB');
//     console.log('Server is started at http://localhost:' + PORT);

// });


// 2022UCI8039
//npm install mongodb@5.5
//mongodb+srv://priyeshtiwari045:2022UCI8039@cluster0.16s2jad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0