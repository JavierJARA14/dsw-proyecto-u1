const admin = require("../config/config");
const db = admin.firestore();
const collection = db.collection("carts");

// Obtener todos los carritos
async function getAllCarts() {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Obtener carrito por ID
async function getById(id) {
  const cart = await collection.doc(id).get();
  if (!cart.exists) return null;
  return { id: cart.id, ...cart.data() };
}

// Obtener carritos por usuario (por id de usuario)
async function getByUserId(userId) {
  const querySnapshot = await collection.where("user.id", "==", userId).get();
  if (querySnapshot.empty) return [];
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Crear nuevo carrito
async function addCart(data) {
  const added = await collection.add(data);
  return { id: added.id, ...data };
}

// Actualizar carrito
async function updateCart(id, data) {
  await collection.doc(id).update(data);
  return getById(id);
}

// Eliminar carrito
async function deleteCart(id) {
  const doc = collection.doc(id);
  const exists = await doc.get();
  if (!exists.exists) return null;
  await doc.delete();
  return { id };
}

module.exports = {
  getAllCarts,
  getById,
  getByUserId,
  addCart,
  updateCart,
  deleteCart
};
