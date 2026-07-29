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
    const { rut, id_direccion } = req.body;

    if (!rut || !id_direccion) {
        return res.status(400).json({ ok: false, mensaje: 'Faltan datos: rut o id_direccion' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Insertar orden
        const ordenResult = await client.query({
            text: `INSERT INTO orden (rut, id_direccion, precio_total)
             VALUES ($1, $2, $3)
             RETURNING id_orden`,
            values: [rut, id_direccion, 0]
        });
        const id_orden = ordenResult.rows[0].id_orden;

        // 2. Insertar despacho (nuevo)
        await client.query({
            text: `INSERT INTO despachos (id_orden, id_direccion)
             VALUES ($1, $2)`,
            values: [id_orden, id_direccion]
        });

        await client.query('COMMIT');
        res.status(201).json({ ok: true, mensaje: 'Orden y despacho creados (paso 2)', id_orden });

    } catch (e) {
        await client.query('ROLLBACK');
        console.error(e);
        res.status(500).json({ ok: false, mensaje: e.message });

    } finally {
        client.release();
    }
}

module.exports = { getOrders, createOrder };