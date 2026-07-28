const express = require('express');
const router = express.Router();

const clientesController = require('../controllers/customers');

router.get('/', (req, res) => {
    const { filtro } = req.query;

    if (filtro === 'clientes') {
        return clientesController.getClientes(req, res);
    }

    // por ahora, si el filtro no existe todavía, respondemos claro
    res.status(400).json({ ok: false, mensaje: 'Filtro no reconocido o no implementado' });
});

module.exports = router;