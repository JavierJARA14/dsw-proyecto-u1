// src/config/index.js

// NOTA: NO necesitas 'dotenv' aquí. Lo cargaremos en el archivo principal.

// 1. Intenta leer la config de Firebase (producción)
// 2. Si no existe, lee la config de .env (local) que cargaremos al inicio
const facturapiKey = process.env.FACTURAPI_API_KEY;

if (!facturapiKey) {
  console.warn('¡ALERTA! La API Key de Facturapi no está configurada.');
}

const appConfig = {
  facturapi: {
    apiKey: facturapiKey,
    baseUrl: 'https://www.facturapi.io/v2'
  }
};

module.exports = appConfig;