const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use('/', require('./routes'));   // tus rutas van primero

// 404 - Ruta que no existe
app.use((req, res) => {
    res.status(404).json({ ok: false, mensaje: "Ruta no encontrada" });
});

// 500 - Error inesperado del servidor
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ ok: false, mensaje: "Algo salió mal. Intenta de nuevo más tarde." });
});

module.exports = app;