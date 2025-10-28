const express = require("express");
const controller = require("../controllers/user.controller");

const router = express.Router();

router.get("/", controller.getAllUsers);
router.get("/:id", controller.getUserById);
router.get("/role/:role", controller.getUsersByRole);
router.post("/", controller.addUser);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

module.exports = router;
