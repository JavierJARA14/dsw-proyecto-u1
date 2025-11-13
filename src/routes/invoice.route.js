const express = require("express");
const router = express.Router();
const { generarFactura, mostrarFacturaPDF, listarFacturas } = require("../controllers/invoice.controller");
const { authenticate } = require("../middleware/auth.middleware");
const roleAuth = require("../middleware/role.middleware");

router.post("/", authenticate, roleAuth("admin"), generarFactura);
router.get("/", authenticate, roleAuth("admin"), listarFacturas);
router.get("/pdf/:id", authenticate, roleAuth("admin"), mostrarFacturaPDF);

module.exports = router;
