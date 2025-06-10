# FROM registry.smehost.net:5000/inetu/base-wordpress:php8


# Imagen base para Node.js
FROM node:20

# Crear directorio de trabajo
WORKDIR /app

# Copiar backend y frontend al contenedor
COPY backend ./backend
COPY frontend ./frontend

# Instalar dependencias del backend
WORKDIR /app/backend
RUN npm install

# Construir el frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Volver al backend
WORKDIR /app/backend

# Exponer el puerto 80 (porque tu backend corre directamente en ese puerto)
EXPOSE 80

# Iniciar el backend
CMD ["node", "index.js"]