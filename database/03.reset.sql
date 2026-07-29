-- 03-reset.sql
-- Elimina todas las tablas y las vuelve a crear con datos de prueba.
-- archivos relativos a la ubicación de este mismo script.

DROP TABLE IF EXISTS lista_productos CASCADE;
DROP TABLE IF EXISTS despachos CASCADE;
DROP TABLE IF EXISTS orden CASCADE;
DROP TABLE IF EXISTS direcciones CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS productos CASCADE;

