const pool = require('../db/pool');

async function getCustomers(req, res) {
    const { rut } = req.query;

    try {
        if (rut) {
            // GET ?filtro=clientes&rut=<rut> -> cliente por rut
            const { rows } = await pool.query({
                text: 'SELECT * FROM clientes WHERE rut = $1',
                values: [rut]
            });

            if (rows.length === 0) {
                return res.status(404).json({ ok: false, mensaje: 'Cliente no encontrado' });
            }
            return res.status(200).json(rows[0]);
        }

        // GET ?filtro=clientes -> lista completa
        // pool query nos trae un objeto gigante así que lo destructuramos , y solo nos traemos row
        const { rows } = await pool.query('SELECT * FROM clientes');
        res.status(200).json(rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar clientes' });
    }
}

module.exports = { getCustomers };