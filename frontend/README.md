# Frontend — React + Vite

Interfaz de usuario de SenaSoft (React + Vite + Bootstrap). Se comunica con la
API PHP (`backend/`) mediante axios.

## Scripts

```
npm run dev       Servidor de desarrollo
npm run build     Compilación de producción
npm run lint      Análisis estático (ESLint)
npm run preview   Vista previa del build
```

## Variables de entorno

- `VITE_API_URL`: URL base de la API (por defecto `http://<host>:8000/api`).

## Estructura

```
src/
  components/      Componentes reutilizables (Sidebar, Navbar, ...)
  context/         Contexto de autenticación (AuthContext)
  pages/           Vistas (Login, Dashboard, Productos, Ventas, ...)
  services/        Clientes de la API (axios)
  App.jsx          Enrutamiento (react-router)
  main.jsx         Punto de entrada
```