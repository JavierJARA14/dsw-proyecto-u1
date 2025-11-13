const axios = require('axios');

const api = axios.create({
  baseURL: "https://www.facturapi.io/v2",
  headers: {
    Authorization: `Bearer ${process.env.FACTURAPI_API_KEY}`,
    "Content-Type": "application/json"
  }
});

const createCustomer = async (data) => {
  const res = await api.post("/customers", data);
  return res.data;
};

const createProduct = async (data) => {
  try {
    const res = await api.post("/products", {
      name: data.name,
      price: data.price,
      product_key: "60101811",
      unit_key: data.unit_key || "H87",
      stock: data.stock,
      description: data.descripcion || "Producto",
      tax_included: data.tax_included !== undefined ? data.tax_included : true
    });
    return res.data;
  } catch (error) {
    console.error("Error al crear producto en FacturAPI:", error.response?.data || error.message);
    throw error;
  }
};

const createInvoice = async (invoiceData) => {
  try {
    const res = await api.post("/invoices", invoiceData);
    return res.data;
  } catch (error) {
    console.error("Error al generar factura:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error creando factura en FacturAPI");
  }
};

const getAllInvoices = async () => {
  try {
    const res = await api.get("/invoices");
    return res.data;
  } catch (error) {
    console.error("Error al obtener facturas:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error obteniendo facturas de FacturAPI");
  }
};

const getInvoicePDF = async (id) => {
  try {
    const res = await api.get(`/invoices/${id}/pdf`, {
      responseType: "arraybuffer"
    });
    return res.data; 
  } catch (error) {
    console.error("Error al obtener PDF:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error obteniendo PDF de FacturAPI");
  }
};

module.exports = {
  createCustomer,
  createProduct,
  createInvoice,
  getAllInvoices,
  getInvoicePDF,
};
