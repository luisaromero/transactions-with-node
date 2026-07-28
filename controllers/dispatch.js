const pool = require('../db/pool');

async function getDispatch(req, res) {
    const { orden } = req.query;

    if (!orden) {
        return res.status(400).json({ ok: false, mensaje: 'Falta el parámetro orden' });
    }

    try {
        const { rows } = await pool.query({
            text: 'SELECT * FROM despachos WHERE id_orden = $1',
            values: [orden]
        });

        res.status(200).json(rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar despachos' });
    }
}

module.exports = { getDispatch };