const express = require("express");
require('dotenv').config();

const app = express();

app.use(express.json());

const productRoutes = require("./routes/product.route");
const authRoutes = require("./routes/auth.routes");

//rutas de usuarios
const userRoutes = require("./routes/user.route");
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/products", productRoutes);
app.use("/api/users", authRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
