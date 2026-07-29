-- 02-seed.sql
-- Datos de prueba: tienda de artículos de pádel para mujer.

-- 1. Clientes
INSERT INTO clientes (rut, nombre) VALUES
    ('12345678-5', 'Ana Pérez'),
    ('11222333-K', 'Bruno Soto'),
    ('9876543-3',  'Camila Rojas'),
    ('15678901-2', 'Diego Muñoz'),
    ('17890123-4', 'Elena Vega');

-- 2. Direcciones (cada cliente tiene al menos una)
INSERT INTO direcciones (rut, direccion) VALUES
    ('12345678-5', 'Av. Providencia 1234, Providencia, Santiago'),
    ('11222333-K', 'Los Militares 5678, Las Condes, Santiago'),
    ('9876543-3',  'Av. Colón 890, Concepción'),
    ('15678901-2', 'Av. Pedro de Valdivia 456, Ñuñoa, Santiago'),
    ('17890123-4', 'Camino Real 321, La Serena');

-- 3. Productos (artículos de pádel para mujer)
-- existencias: convertido desde "disponible" del catálogo original.
-- disponible = true  -> stock asignado
-- disponible = false -> 0 (sin stock, útil para probar el rollback de la transacción)
INSERT INTO productos (nombre, precio, existencias) VALUES
    ('Conjunto Padel Mujer Naranjo',            45000, 12),
    ('Conjunto Padel Mujer Negro',               45000, 8),
    ('Raqueta Rosada',                           46000, 15),
    ('Raqueta Multicolor',                       40000, 20),
    ('Polera Polo Rosada',                       20000, 0),
    ('Raqueta de Padel Pro Aquamarine',          89000, 5),
    ('Falda Deportiva Azul',                     19000, 0),
    ('Raqueta de Padel Iniciación',              55000, 10),
    ('Conjunto Padel Mujer Rosado',               62000, 7),
    ('Botella de Agua Rosada 750ml',               9000, 30),
    ('Jockey Deportiva azul',                    15000, 18),
    ('Tubo de Pelotas Padel x3',                   7500, 25);

-- 4. Una orden de ejemplo, ya con su despacho y productos,
--    para que los GET tengan algo real que mostrar desde el inicio.
INSERT INTO orden (rut, id_direccion, precio_total)
VALUES (
    '12345678-5',
    (SELECT id_direccion FROM direcciones WHERE rut = '12345678-5'),
    91000
);

INSERT INTO despachos (id_orden, id_direccion)
VALUES (
    (SELECT id_orden FROM orden WHERE rut = '12345678-5' ORDER BY id_orden DESC LIMIT 1),
    (SELECT id_direccion FROM direcciones WHERE rut = '12345678-5')
);

INSERT INTO lista_productos (id_orden, id_producto, cantidad_producto)
VALUES
    (
        (SELECT id_orden FROM orden WHERE rut = '12345678-5' ORDER BY id_orden DESC LIMIT 1),
        (SELECT id_producto FROM productos WHERE nombre = 'Raqueta Rosada'),
        1
    ),
    (
        (SELECT id_orden FROM orden WHERE rut = '12345678-5' ORDER BY id_orden DESC LIMIT 1),
        (SELECT id_producto FROM productos WHERE nombre = 'Tubo de Pelotas Padel x3'),
        6
    );