const axios = require('axios');

const api = axios.create({
  baseURL: 'https://www.facturapi.io/v2',
  headers: {
    Authorization: `Bearer ${process.env.FACTURAPI_API_KEY}`
  }
});

const createCustomer = async (data) => {
  const res = await api.post('/customers', data);
  return res.data;
};

const createProduct = async (data) => {
  try{
    const res = await api.post('/products', {
      name: data.nombre,
      price: data.precio,
      product_key: data.product_key || "60101811",
      unit_key: data.unit_key || "H87",
      stock: data.stock,
      description: data.descripcion,
      tax_included: data.tax_included !== undefined ? data.tax_included : true
    });
    return res.data;
  } catch (error) {
    console.error('Error al crear producto en FacturAPI:', error.response?.data || error.message);
    throw error;
  }

};

exports.createInvoice = async (invoiceData) => {
   try {
    const response = await facturapiClient.post('/invoices', invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error al crear factura en Facturapi:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error en el servicio de Facturapi');
  }
};

module.exports = {
  createCustomer
}