import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { connectDatabase } from "./database/index";

import authRoute from "./routes/authRoute";
import productsRoute from "./routes/productsRoute";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// connect to database
connectDatabase();

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.json(), cors());

app.use(express.urlencoded({ extended: true }));

// Connect all routes
app.use("/auth", authRoute);
app.use("/products", productsRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
