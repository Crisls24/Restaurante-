# Xiú — Sistema de Reservaciones para Restaurante

Sistema de **reservaciones** para el restaurante "Xiú – Alta Cocina Mexicana", con
arquitectura **SOA**: una SPA React, un microservicio de autenticación/reservaciones
(NestJS) y un microservicio de menú/mesas (FastAPI), sobre MySQL y MongoDB.

## Stack

- **Frontend:** React 19 + Vite + React Router 7 (deploy a Vercel).
- **auth-service:** NestJS 11 + TypeORM + MySQL, JWT, bcrypt, Swagger y Twilio
  (notificaciones WhatsApp/SMS). Deploy a Railway.
- **menu-service:** FastAPI + Motor/PyMongo (MongoDB). Deploy a Render.
- **Infra:** `docker-compose.yml` (MySQL 8.0 + MongoDB 7.0).

## Funcionalidades

- Autenticación JWT con roles: `cliente`, `admin`, `mesero`, `cocina`.
- CRUD de platillos del menú (solo admin) y filtros por categoría / búsqueda.
- Reservaciones: crear, mesas disponibles, reservas del día y cancelación.
- Tablero de mesas y panel de administración.
- Notificaciones por WhatsApp/SMS vía Twilio.

## Configuración

Copia `.env.example` a `.env` y completa los valores (MySQL, MongoDB, JWT, Twilio):

```sh
cp .env.example .env
```

Importante: `JWT_SECRET` es **obligatorio** (el auth-service falla al arrancar si no
está configurado).

### Admin por defecto

El endpoint `POST /auth/seed-admin` crea el usuario admin una vez. Las credenciales
se leen desde el entorno:

```env
SEED_ADMIN_EMAIL=admin@xiu.mx
SEED_ADMIN_PASSWORD=cambia_esta_contrasena
```

## Cómo ejecutar

```sh
docker compose up -d                # MySQL + MongoDB

cd services/auth-service
npm install && npm run start:dev    # http://localhost:3000 (Swagger /docs)

cd services/menu-service
pip install -r requirements.txt
uvicorn app.main:app --port 8000    # http://localhost:8000

cd frontend
npm install && npm run dev          # http://localhost:5173
```

## Soporte

Stack web completo; despliegue listo para Vercel (frontend), Railway (auth) y Render (menu).