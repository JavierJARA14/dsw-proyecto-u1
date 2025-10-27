const admin = require("../config");
const db = admin.firestore();
module.exports = db;
const collection = db.collection("products");

async function getAllProducts() {
    const snapshot = await collection.get();
    return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
}

async function getById(id) {
    const product = await collection.doc(id).get();
    if (!product.exists) return null;
    return {id: product.id, ...product.data()};
}

async function availableProducts() {
    const querySnapshot = await collection.where("stock", ">", 0).get();
    if(querySnapshot.empty) return null;
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return products;
}

async function getByCategory(category) {
    const querySnapshot = await collection.where("category", "==", category).get();
    if(querySnapshot.empty) return null;
    const products = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return products;
}

async function addProduct(data) {
    const addedProduct = await collection.add(data);
    return {id: addedProduct.id, ...data};
}

async function updateProduct(id, data) {
    await collection.doc(id).update(data);
    return this.getById(id);
}

async function deleteProduct(id) {
    await collection.doc(id).delete();
    return { id };
}

//Agregar: search, category
module.exports = {
    getAllProducts, 
    getById, 
    availableProducts,
    getByCategory,
    addProduct, 
    updateProduct, 
    deleteProduct
};