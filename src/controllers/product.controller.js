const Product = require("../models/product.model");

async function getAllProducts(req, res) {
    try {
        const data = await Product.getAllProducts();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: "Cannot connect to server."});
    }
}

async function getById(req, res) {
    try {
        const data = await Product.getById(req.params.id);
        if(!data) return res.status(404).json({message: "This product doesn´t exists."});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: "Cannot connect to server."});
    }
}

async function availableProducts(req, res) {
    try {
        const data = await Product.availableProducts();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: "Cannot connect to server."});
    }
}

async function getByCategory(req, res) {
    try {
        const data = await Product.getByCategory(req.params.category);
        if(!data) return res.status(404).json({message: "This category doesn´t exists."});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: "Cannot connect to server."});
    }
}

async function addProduct(req, res) {
    try {
        if(!req.body.category || !req.body.name || req.body.price == null || !req.body.sat_code || req.body.stock == null)
            return res.status(400).json({ message: "This/These entry cannot be empty." });
        const newProduct = await Product.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({message: "Cannot connect to server."});
    }
}

async function updateProduct(req, res) {
    try {
        const exists = await Product.getById(req.params.id);
        if(!exists) return res.status(404).json({message: "This product doesn't exists."});
        if(!req.body.category || !req.body.name || req.body.price == null || !req.body.sat_code || req.body.stock == null)
            return res.status(400).json({ message: "This/These entry cannot be empty." });
        const updated = await Product.updateProduct(req.params.id, req.body);
        return res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({message: "Cannot connect to server."});
    }
}

async function deleteProduct(req, res) {
    try {
    const deleted = await Product.deleteProduct(req.params.id);
    return deleted ? res.status(204).send() : res.status(404).json({ message: "This product doesn't exists." });
  } catch (error) {
    res.status(500).json({message: "Cannot connect to server."});
  }
}

module.exports = {
    getAllProducts,
    getById,
    getByCategory,
    availableProducts,
    addProduct,
    updateProduct,
    deleteProduct,
};