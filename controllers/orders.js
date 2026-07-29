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

module.exports = { getOrders };