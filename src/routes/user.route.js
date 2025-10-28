const express = require("express");
const controller = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth.middleware");
const roleAuth = require("../middleware/role.middleware");

const router = express.Router();

// admin
router.get("/", authenticate, roleAuth("admin"), controller.getAllUsers);
router.get("/username/:username", authenticate, roleAuth("admin"), controller.getUserByUsername);
router.get("/role/:role", authenticate, roleAuth("admin"), controller.getUsersByRole);
router.get("/:id", authenticate, roleAuth("admin"), controller.getUserById);
router.post("/", authenticate, roleAuth("admin"), controller.addUser);
router.put("/:id", authenticate, roleAuth("admin"), controller.updateUser);
router.delete("/:id", authenticate, roleAuth("admin"), controller.deleteUser);

module.exports = router;
