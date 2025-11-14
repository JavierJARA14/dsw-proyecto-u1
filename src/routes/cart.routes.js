const express = require("express");
const controller = require("../controllers/cart.controller");
const { authenticate } = require("../middleware/auth.middleware");
const roleAuth = require("../middleware/role.middleware");

const router = express.Router();

// admin
router.get("/", authenticate, roleAuth("admin"), controller.getAllCarts);
router.get("/:id", authenticate, controller.getCartById);
router.get("/user/:userId", authenticate, controller.getCartsByUser);
router.post("/", authenticate, controller.addCart);
router.post("/:id/product", authenticate, controller.addProductToCart);
router.put("/:id", authenticate, controller.updateCart);
router.delete("/:cartId/product/:productId", authenticate, controller.deleteProductFromCart);


module.exports = router;
