const express = require("express");
const controller = require("../controllers/product.controller");
const { authenticate } = require("../middleware/auth.middleware");
const roleAuth = require("../middleware/role.middleware");

const router = express.Router();

// todos
router.get("/", authenticate, controller.getAllProducts);
router.get("/available", authenticate, controller.availableProducts);
router.get("/:id", authenticate, controller.getById);
router.get("/category/:category", authenticate, controller.getByCategory);

// admin  
router.post("/", authenticate, roleAuth("admin"), controller.addProduct);
router.put("/:id", authenticate, roleAuth("admin"), controller.updateProduct);
router.delete("/:id", authenticate, roleAuth("admin"), controller.deleteProduct);

module.exports = router;