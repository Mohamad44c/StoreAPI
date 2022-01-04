// dependencies 
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// init
dotenv.config(); // dotenv allows us to hide secret keys and passwords from the source code
const app = express();
app.use(express.json());

// Routes
const userRoute = require("./routes/user");
const authRoute = require("./routes/authentication");
const productRoute = require("./routes/product");
const bagRoute = require("./routes/bag");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");



// NOTE: change server ip address when deploying website
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Successfully connected to mongoDB"))
    .catch((error) => console.log(error));

// using routes 
app.use(cors());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/products", productRoute);
app.use("/api/bags", bagRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

// start server to listen on port 3000
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started and listening on port 3000");
});