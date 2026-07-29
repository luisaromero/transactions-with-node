-- 01-create-tables.sql
-- Crea el esquema de la base de datos para el sistema de
-- administración de ventas, órdenes y despachos.

-- 1. Tablas sin dependencias
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    precio INTEGER NOT NULL,
    existencias INTEGER NOT NULL
);

CREATE TABLE clientes (
    rut VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- 2. Direcciones depende de clientes (rut)
CREATE TABLE direcciones (
    id_direccion SERIAL PRIMARY KEY,
    rut VARCHAR(10) NOT NULL REFERENCES clientes(rut),
    direccion VARCHAR(200) NOT NULL
);

-- 3. Orden depende de clientes y direcciones
CREATE TABLE orden (
    id_orden SERIAL PRIMARY KEY,
    rut VARCHAR(10) NOT NULL REFERENCES clientes(rut),
    id_direccion INTEGER NOT NULL REFERENCES direcciones(id_direccion),
    precio_total INTEGER NOT NULL
);

-- 4. Despachos depende de orden y direcciones
CREATE TABLE despachos (
    id_despacho SERIAL PRIMARY KEY,
    id_orden INTEGER NOT NULL REFERENCES orden(id_orden),
    id_direccion INTEGER NOT NULL REFERENCES direcciones(id_direccion)
);

-- 5. Lista_productos depende de orden y productos
CREATE TABLE lista_productos (
    id_lista SERIAL PRIMARY KEY,
    id_orden INTEGER NOT NULL REFERENCES orden(id_orden),
    id_producto INTEGER NOT NULL REFERENCES productos(id_producto),
    cantidad_producto INTEGER NOT NULL
);