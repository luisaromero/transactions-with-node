const pool = require('../db/pool');

async function getOrders(req, res) {
    const { rut } = req.query;

    if (!rut) {
        return res.status(400).json({ ok: false, mensaje: 'Falta el parámetro rut' });
    }

    try {
        const { rows } = await pool.query({
            text: 'SELECT * FROM orden WHERE rut = $1',
            values: [rut]
        });

        res.status(200).json(rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar órdenes' });
    }
}

async function createOrder(req, res) {

    const { rut, id_direccion, productos } = req.body;

    if (!rut || !id_direccion || !productos || productos.length === 0) {
        return res.status(400).json({ ok: false, mensaje: 'Faltan datos: rut, id_direccion o productos' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Insertar orden
        const ordenResult = await client.query({
            text: `INSERT INTO orden (rut, id_direccion, precio_total)
             VALUES ($1, $2, $3)
             RETURNING id_orden`,
            values: [rut, id_direccion, 0] // precio_total se calcula más abajo
        });
        const id_orden = ordenResult.rows[0].id_orden;

        // 2. Insertar despacho
        await client.query({
            text: `INSERT INTO despachos (id_orden, id_direccion)
             VALUES ($1, $2)`,
            values: [id_orden, id_direccion]
        });

        // 3. Insertar lista de productos, restar stock y sumar el total
        let precioTotal = 0;

        for (const item of productos) {
            // Traigo el precio actual del producto para calcular el total
            const productoResult = await client.query({
                text: 'SELECT precio FROM productos WHERE id_producto = $1',
                values: [item.id_producto]
            });

            if (productoResult.rowCount === 0) {
                throw new Error(`Producto ${item.id_producto} no existe`);
            }

            const precio = productoResult.rows[0].precio;
            precioTotal += precio * item.cantidad;

            await client.query({
                text: `INSERT INTO lista_productos (id_orden, id_producto, cantidad_producto)
               VALUES ($1, $2, $3)`,
                values: [id_orden, item.id_producto, item.cantidad]
            });

            // 4. Actualizar stock, validando que no quede negativo
            const updateResult = await client.query({
                text: `UPDATE productos
               SET existencias = existencias - $1
               WHERE id_producto = $2 AND existencias >= $1
               RETURNING existencias`,
                values: [item.cantidad, item.id_producto]
            });

            if (updateResult.rowCount === 0) {
                throw new Error(`Stock insuficiente para el producto ${item.id_producto}`);
            }
        }

        // Actualizo el precio_total ahora que ya lo calculé
        await client.query({
            text: 'UPDATE orden SET precio_total = $1 WHERE id_orden = $2',
            values: [precioTotal, id_orden]
        });

        await client.query('COMMIT');
        res.status(201).json({
            ok: true,
            mensaje: 'Orden creada',
            id_orden,
            precio_total: precioTotal
        });

    } catch (e) {
        await client.query('ROLLBACK');
        console.error(e);

        const esFaltaStock = e.message.includes('Stock insuficiente');
        res.status(esFaltaStock ? 409 : 500).json({ ok: false, mensaje: e.message });

    } finally {
        client.release();
    }
}


module.exports = { getOrders, createOrder };