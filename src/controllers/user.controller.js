const User = require("../models/user.model");
const facturapiService =  require("../services/facturapi.service");

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

// Obtener usuario por username
async function getUserByUsername(req, res) {
    try {
        const username = req.params.username;
        const user = await User.findByUsername(username);
        if (!user) return res.status(404).json({ message: "User not found" });
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
    const {username, role, address, rfc, password, mail } = req.body;
    if (!username || !role || !address || !rfc || !password || !mail)
      return res.status(400).json({ message: "This/These entry cannot be empty." });
    const customer = {
      legal_name: req.body.username,
      tax_id: req.body.rfc,
      tax_system: "612",
       address: {
          zip: '86991',
          neighborhood: req.body.address.colonia || 'Colonia Falsa',
          street: req.body.address.direccion || 'Calle Falsa 123',
          exterior: req.body.address.numeroExterior || '123'
        },
    };
    const facturapiRes = await facturapiService.createCustomer(customer);
    const facturapi_id = facturapiRes.id;
    const newUser = await User.addUser({ facturapi_id, username, role, address, rfc, password, mail });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server.", error: error});
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
  getUserByUsername,
  getUsersByRole,
  addUser,
  updateUser,
  deleteUser
};
