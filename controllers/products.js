const pool = require('../db/pool');

async function getProducts(req, res) {
    const { id, orden } = req.query;

    try {
        // GET ?filtro=productos&id=<id_producto> -> producto por id
        if (id) {
            const { rows } = await pool.query({
                text: 'SELECT * FROM productos WHERE id_producto = $1',
                values: [id]
            });

            if (rows.length === 0) {
                return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
            }
            return res.status(200).json(rows[0]);
        }

        // GET ?filtro=productos&orden=<id_orden> -> productos de una orden
        if (orden) {
            const { rows } = await pool.query({
                text: `SELECT p.*, lp.cantidad_producto
               FROM lista_productos lp
               JOIN productos p ON p.id_producto = lp.id_producto
               WHERE lp.id_orden = $1`,
                values: [orden]
            });
            return res.status(200).json(rows);
        }

        // GET ?filtro=productos -> lista completa
        const { rows } = await pool.query('SELECT * FROM productos');
        res.status(200).json(rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar productos' });
    }
}

module.exports = { getProducts };