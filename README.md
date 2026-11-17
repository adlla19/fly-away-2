# Fly Away Travel — Frontend

SPA para la API de reserva de vuelos **Fly Away** (CS2031 · Semana 14).

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · Axios · React Router

## Cómo correrlo

Requisitos: Node.js 20.19+ / 22.12+ y el backend corriendo en `http://localhost:8080`.

```bash
# 1. Backend (en su propia carpeta, requiere JDK 26)
cd ../cs2031-2026-2-week14-fly-away-backend
./mvnw spring-boot:run

# 2. Frontend (en esta carpeta)
npm install
npm run dev        # http://localhost:5173
```

Para apuntar a otro backend, copia `.env.example` a `.env` y cambia `VITE_API_URL`.

Usuario de prueba precargado por el backend: `ana.garcia@utec.edu.pe` / `Password1`.

## Funcionalidades

| Pantalla | Ruta | Endpoint | Acceso |
|---|---|---|---|
| Registro | `/register` | `POST /users/register` | invitado |
| Login + nombre del usuario | `/login` | `POST /auth/login`, `GET /users/current` | invitado |
| Búsqueda (número, aerolínea, rango de fechas) | `/search` | `GET /flights/search` | público |
| Reservar (botón en cada resultado) | `/search` | `POST /flights/book` | autenticado |
| Mis reservas | `/bookings` | `GET /flights/book/{id}` | protegida |
| Detalle de reserva | `/bookings/:id` | `GET /flights/book/{id}` | protegida |

- El JWT se guarda en `localStorage` bajo la clave `token`; el logout lo elimina.
- Las rutas protegidas redirigen a `/login` si no hay token. Ante un `403` con token (token inválido), se limpia la sesión y se vuelve al login.
- Los IDs de reservas se guardan en `localStorage` por usuario (`bookings:<email>`), porque el backend no tiene un endpoint para listarlas.
- Los errores del backend (`ProblemDetail.detail`) se muestran al usuario: contraseña débil, email en uso, credenciales incorrectas, vuelo pasado, horario superpuesto.

## Estructura

```
src/
├── api/          # cliente Axios (interceptores), endpoints tipados, manejo de errores
├── auth/         # AuthContext (token + usuario actual), rutas protegidas
├── components/   # Navbar, Layout, SearchForm, FlightsTable, UI (Button, Alert, TextField…)
├── lib/          # localStorage (token, reservas) y formato de fechas
├── pages/        # Register, Login, Search, MyBookings, BookingDetail, NotFound
└── types.ts      # tipos de los DTOs del backend
```
