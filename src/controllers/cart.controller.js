const Cart = require("../models/cart.model");
const facturapiService = require("../services/facturapi.service");

// Obtener todos los carritos
async function getAllCarts(req, res) {
  try {
    const carts = await Cart.getAllCarts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

// Obtener carrito por ID
async function getCartById(req, res) {
  try {
    const cart = await Cart.getById(req.params.id);
    if (!cart) return res.status(404).json({ message: "This cart doesn't exist." });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

// Obtener carritos de un usuario
async function getCartsByUser(req, res) {
  try {
    const carts = await Cart.getByUserId(req.params.userId);
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

// Crear carrito
async function addCart(req, res) {
  const { user, products, pagado, subtotal, iva, total, id_factura, id_stripe } = req.body;

  try {
    if (!user || !products || products.length === 0)
      return res.status(400).json({ message: "Missing user or products." });

    // Generar factura en Facturapi solo si ya está pagado
    let facturapi_id = null;
    if (pagado) {
      const invoice = await facturapiService.createInvoice({
        customer: user.id_facturapi,
        items: products.map(p => ({
          quantity: p.cantidad,
          product: p.idProduct,
        })),
        payment_form: "03", // transferencia
      });
      facturapi_id = invoice.id;
    }

    const newCart = await Cart.addCart({
      user,
      products,
      pagado: pagado || false,
      subtotal: subtotal || 0,
      iva: iva || 0,
      total: total || 0,
      id_factura: facturapi_id || id_factura || null,
      id_stripe: id_stripe || null,
      createdAt: new Date().toISOString()
    });

    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot create cart.", error });
  }
}

// Agregar un producto a un carrito existente
async function addProductToCart(req, res) {
  const { id } = req.params; // ID del carrito
  const { product } = req.body; // { idProduct, cantidad, precio }

  try {
    const cart = await Cart.getById(id);
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    const updatedProducts = [...cart.products, product];
    const updatedCart = await Cart.updateCart(id, { products: updatedProducts });

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot add product to cart.", error });
  }
}


// Actualizar carrito (por ejemplo, para marcar como pagado)
async function updateCart(req, res) {
  try {
    const exists = await Cart.getById(req.params.id);
    if (!exists) return res.status(404).json({ message: "This cart doesn't exist." });

    const updated = await Cart.updateCart(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

// Eliminar carrito
async function deleteCart(req, res) {
  try {
    const deleted = await Cart.deleteCart(req.params.id);
    if (!deleted) return res.status(404).json({ message: "This cart doesn't exist." });
    res.status(200).json({ message: "Cart deleted." });
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server." });
  }
}

module.exports = {
  getAllCarts,
  getCartById,
  getCartsByUser,
  addCart,
  updateCart,
  deleteCart,
  addProductToCart
};
