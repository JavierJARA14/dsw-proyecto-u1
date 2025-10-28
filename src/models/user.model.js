const admin = require("../config");
const db = admin.firestore();
const collection = db.collection("users");

// Obtener todos los usuarios
async function getAllUsers() {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Obtener usuario por ID
async function getById(id) {
  const user = await collection.doc(id).get();
  if (!user.exists) return null;
  return { id: user.id, ...user.data() };
}

// Obtener usuarios por rol
async function getByRole(role) {
  const querySnapshot = await collection.where("role", "==", role).get();
  if (querySnapshot.empty) return [];
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Agregar usuario
async function addUser(data) {
  const addedUser = await collection.add(data);
  return { id: addedUser.id, ...data };
}

// Actualizar usuario
async function updateUser(id, data) {
  await collection.doc(id).update(data);
  return getById(id);
}

// Eliminar usuario
async function deleteUser(id) {
  const doc = collection.doc(id);
  const exists = await doc.get();
  if (!exists.exists) return null;
  await doc.delete();
  return { id };
}

module.exports = {
  getAllUsers,
  getById,
  getByRole,
  addUser,
  updateUser,
  deleteUser
};
