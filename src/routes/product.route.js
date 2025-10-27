const express = require("express");
const controller = require("../controllers/product.controller");
//const { authenticate } = require("");

const router = express.Router();

router.get("/", controller.getAllProducts);
router.get("/available", controller.availableProducts);
router.get("/:id", controller.getById);
router.get("/category/:category", controller.getByCategory);
router.post("/", controller.addProduct);
router.put("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

module.exports = router;