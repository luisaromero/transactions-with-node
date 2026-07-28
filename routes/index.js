const express = require('express');
const router = express.Router();

const customersController = require('../controllers/customers');

const addressController = require('../controllers/address');

const dispatchController = require('../controllers/dispatch');

router.get('/', (req, res) => {
    const { filtro } = req.query;

    if (filtro === 'clientes') {
        return customersController.getClientes(req, res);
    }
    if (filtro === 'direcciones') {
        return addressController.getAddress(req, res);
    }
    if (filtro === 'despachos') return dispatchController.getDispatch(req, res);

    res.status(400).json({ ok: false, mensaje: 'Filtro no reconocido o no implementado' });
});

module.exports = router;