const User = require("../models/user.model");

// Obtener todos los usuarios
async function getAllUsers(req, res) {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

// Obtener usuario por ID
async function getUserById(req, res) {
  try {
    const user = await User.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "This user doesn't exist." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

// Obtener usuarios por rol
async function getUsersByRole(req, res) {
  try {
    const users = await User.getByRole(req.params.role);
    res.status(200).json(users); // devuelve [] si no hay coincidencias
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

// Crear usuario
async function addUser(req, res) {
  try {
    const { facturapi_id, username, role, address, rfc, password, mail } = req.body;
    if (!username || !role || !address || !rfc || !password || !mail)
      return res.status(400).json({ message: "This/These entry cannot be empty." });

    const newUser = await User.addUser({ facturapi_id, username, role, address, rfc, password, mail });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

// Actualizar usuario
async function updateUser(req, res) {
  try {
    const exists = await User.getById(req.params.id);
    if (!exists) return res.status(404).json({ message: "This user doesn't exist." });

    const { facturapi_id, username, role, address, rfc, password, mail } = req.body;
    if (!username || !role || !address || !rfc || !password || !mail)
      return res.status(400).json({ message: "This/These entry cannot be empty." });

    const updated = await User.updateUser(req.params.id, { facturapi_id, username, role, address, rfc, password, mail });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

// Eliminar usuario
async function deleteUser(req, res) {
  try {
    const deleted = await User.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ message: "This user doesn't exist." });
    res.status(200).json({ message: "User deleted." });
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUsersByRole,
  addUser,
  updateUser,
  deleteUser
};
