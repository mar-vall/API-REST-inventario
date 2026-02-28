# 📦 Inventory API – Backend Favorcito Challenge

API REST de inventario desarrollada con Node.js + TypeScript, enfocada en consistencia de datos, seguridad, diseño sólido de base de datos y documentación completa con Swagger/OpenAPI.

## 🏗️ Stack Tecnológico

* Node.js
* TypeScript
* Express
* Prisma ORM
* Base de datos relacional (PostgreSQL)
* Swagger / OpenAPI

## 🚀 Instalación (local)

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/mar-vall/API-REST-inventario
cd inventory-api
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Configurar variables de entorno
Crear un archivo .env en la raíz del proyecto, puedes copiar el .env.example con tus datos.
Nota: La variable DB_HOST en local es localhost. Por lo que:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory_db"
```

### 4️⃣ Ejecutar migraciones
```bash
npx prisma migrate dev
```

### 5️⃣ Generar cliente Prisma
```bash
npx prisma generate
```

### 6️⃣ Ejecutar el servidor en desarrollo
```bash
npm run dev
```

La API estará disponible en:

```bash
http://localhost:3000
```

La documentación Swagger estará disponible en:

```bash
http://localhost:3000/api/docs
``` 

## 🚀 Instalación (Docker)

Asegurate de tener las variables de entorno bien configuradas primero
```bash
# El host debe coincidir con el nombre del servicio en docker-compose.yml
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/inventory_db"
```

### Levantar contenedores
```bash
docker compose up --build
``` 

### Ejecutar migraciones (primer arranque)
```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npx prisma generate
``` 

## 🧠 Decisiones Técnicas
### 🔹 Base de Datos: Relacional (PostgreSQL)

Se eligió una base de datos relacional porque:
* El dominio requiere consistencia fuerte
* Existen múltiples relaciones (productos ↔ órdenes ↔ movimientos)
* Se necesitan transacciones atómicas
* Se requiere evitar estados inconsistentes (ej: stock negativo)

### 🗃️ Diseño de Base de Datos
![erd](<Inventory ERD.png>)

Cada entidad cumple una función clara:

- `Product` → Estado actual del producto
- `ProductHistory` → Auditoría de cambios
- `Order` → Gestión de órdenes y flujo de estados
- `OrderItem` → Snapshot del producto en el momento de compra
- `InventoryMovement` → Registro inmutable de movimientos de stock

Esto evita sobrecargar tablas con múltiples responsabilidades.

---

En lugar de sobrescribir datos sin control, se implementó `ProductHistory` que registra:

- Campo modificado
- Valor anterior
- Valor nuevo
- Fecha del cambio
---
### 🔐 Seguridad Implementada

Se consideraron y mitigaron las siguientes vulnerabilidades:

1️⃣ Inyección SQL

* Uso exclusivo de Prisma ORM.
* No se construyen queries manuales.
* Parámetros siempre tipados.

2️⃣ Manipulación de Payload

* Validación estricta con DTOs.
* Rechazo de campos no esperados.
* Validación de tipos y formatos.

3️⃣ Datos Malformados

* Validación centralizada.
* Middleware global de manejo de errores.
* Respuestas consistentes.

4️⃣ Exposición de Información Sensible

No se exponen:

* Stack traces
* Errores internos
* Detalles del motor de base de datos
* Errores en producción devuelven mensaje controlado.

5️⃣ Estados Inconsistentes

* Uso de transacciones.
* Validaciones previas de stock.
* Control de transiciones de estado.
---
### 🏛️ Arquitectura del Proyecto

Se utilizó arquitectura por capas:

```
src/
├── config/        # Configuración general (env, swagger, etc.)
├── controllers/   # Manejo de requests y responses HTTP
├── database/      # Configuración y cliente de base de datos
├── dtos/          # Data Transfer Objects (validación y tipado de entrada)
├── services/      # Lógica de negocio y reglas de dominio
├── routes/        # Definición de endpoints y conexión con controllers
├── middlewares/   # Manejo global de errores y validaciones transversales
```

Separación clara entre:

* Lógica de negocio (services)
* Controladores HTTP
* Validaciones
* Acceso a datos