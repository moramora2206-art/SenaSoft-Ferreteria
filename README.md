# SenaSoft — Sistema de Facturación de Ferretería

Proyecto de aprendizaje SENA: sistema de facturación para ferretería con control de
inventario, clientes, proveedores y usuarios con roles.

## Arquitectura

- **Frontend**: React + Vite (JavaScript). Carpeta `frontend/`.
- **Backend**: API REST en PHP 8 + MySQL. Carpeta `backend/`.
- **Base de datos**: scripts SQL en `database/`.

## Estructura

```
backend/                 API PHP (api, config, controllers, models, uploads)
frontend/                Aplicación React (src, public, package.json)
database/                Scripts de base de datos y migraciones
.env.example             Plantilla de variables de entorno
```

## Requisitos

- PHP 8.x
- MySQL 8.x
- Node.js + npm
- (Opcional) XAMPP/Apache

## Configuración

1. **Base de datos**: importar `database/seed_ferreteria.sql` en MySQL
   (base de datos `softwarefacturacion`). Ejecutar las migraciones
   pendientes en `database/migrations/`.
2. **Variables de entorno**: copiar `.env.example` a `.env` y completar las
   credenciales de MySQL y el puerto/orígenes permitidos para la API.
3. **Backend**: exponer la carpeta `backend/` como document root en el puerto
   configurado (`APP_PORT=8000` por defecto). Ejemplos:

   ```
   php -S localhost:8000 -t backend
   ```

   o un VirtualHost de Apache que apunte a `backend/`.

4. **Frontend**:

   ```
   cd frontend
   npm install
   npm run dev
   ```

   Por defecto la API se llama a `http://<host>:8000/api`. Si el backend está
   en otra URL, definir `VITE_API_URL` (ver `.env.example`).

## Scripts del frontend

```
npm run dev       Servidor de desarrollo (Vite)
npm run build     Compilación de producción
npm run lint      Análisis estático (ESLint)
npm run preview   Vista previa del build
```

## Usuarios de prueba

| Usuario | Contraseña | Rol          |
| ------- | ---------- | ------------ |
| diego   | 1234       | Administrador|
| mora    | 123456     | Empleado     |