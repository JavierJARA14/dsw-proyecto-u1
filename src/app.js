const express = require("express");
require('dotenv').config();

//const taskRoutes = require("./routes/task.routes");
//const authRoutes = require("./routes/auth.routes");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/products", taskRoutes);
app.use("/api/users", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
