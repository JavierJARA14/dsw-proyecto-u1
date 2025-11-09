# dsw-proyecto-u1
En este avance se integró Facturapi con los CRUD existentes de usuarios y productos, agregando la capacidad de crear automáticamente clientes y productos dentro de la plataforma de Facturapi. Cada registro obtiene un `facturapi_id` que se guarda en Firebase, permitiendo vinculación con servicios de facturación real.

## Funciones principales
- Crear clientes en Facturapi al registrar usuarios
- Registrar productos directamente en Facturapi
- Almacenar `facturapi_id` dentro de la base de datos
- Validación y manejo de errores en comunicación con Facturapi
