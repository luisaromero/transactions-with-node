router.get('/', (req, res) => {
    const { filtro } = req.query;
    if (filtro === 'productos') return productosController.getProductos(req, res);
    if (filtro === 'clientes') return clientesController.getClientes(req, res);
    // etc.
});
router.post('/orden', ordenesController.crearOrden);