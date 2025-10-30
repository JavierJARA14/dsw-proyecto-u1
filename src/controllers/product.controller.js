const Product = require("../models/product.model");
const facturapiService = require("../services/facturapi.service"); // ← Importamos servicio de facturapi

// Obtener todos los productos
async function getAllProducts(req, res) {
  try {
    const data = await Product.getAllProducts();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

// Obtener producto por ID
async function getById(req, res) {
  try {
    const data = await Product.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "This product doesn't exist." });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

// Obtener productos disponibles
async function availableProducts(req, res) {
  try {
    const data = await Product.availableProducts();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

// Obtener productos por categoría
async function getByCategory(req, res) {
  try {
    const data = await Product.getByCategory(req.params.category);
    if (!data) return res.status(404).json({ message: "This category doesn't exist." });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

// Crear producto y registrarlo en Facturapi
async function addProduct(req, res) {
  try {
    const { category, name, price, sat_code, stock } = req.body;
    if (!category || !name || price == null || !sat_code || stock == null) {
      return res.status(400).json({ message: "This/These entry cannot be empty." });
    }

    // Datos para Facturapi
    const facturapiProduct = {
      description: name,
      product_key: sat_code, // código SAT
      price: parseFloat(price),
      unit_key: "H87", // clave genérica de unidad ("pieza")
    };

    // Crear producto en Facturapi
    const facturapiRes = await facturapiService.createProduct(facturapiProduct);
    const facturapi_id = facturapiRes.id;

    // Guardar en Firestore con el facturapi_id
    const newProduct = await Product.addProduct({
      facturapi_id,
      category,
      name,
      price,
      sat_code,
      stock,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({ message: "Cannot connect to server.", error: error.message });
  }
}

// Actualizar producto (y en Facturapi)
async function updateProduct(req, res) {
  try {
    const exists = await Product.getById(req.params.id);
    if (!exists) return res.status(404).json({ message: "This product doesn't exist." });

    const { category, name, price, sat_code, stock, facturapi_id } = req.body;
    if (!category || !name || price == null || !sat_code || stock == null)
      return res.status(400).json({ message: "This/These entry cannot be empty." });

    // Si tiene un facturapi_id, también actualizamos allá
    if (facturapi_id) {
      await facturapiService.updateProduct(facturapi_id, {
        description: name,
        product_key: sat_code,
        price: parseFloat(price),
      });
    }

    const updated = await Product.updateProduct(req.params.id, {
      facturapi_id,
      category,
      name,
      price,
      sat_code,
      stock,
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ message: "Cannot connect to server.", error: error.message });
  }
}

// Eliminar producto (también en Facturapi)
async function deleteProduct(req, res) {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).json({ message: "This product doesn't exist." });

    // Si tiene facturapi_id, eliminar también allá
    if (product.facturapi_id) {
      await facturapiService.deleteProduct(product.facturapi_id);
    }

    await Product.deleteProduct(req.params.id);
    res.status(200).json({ message: "Product deleted." });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Cannot connect to server.", error: error.message });
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
