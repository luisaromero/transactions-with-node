//  IMPORTS
require('dotenv').config();

const express = require('express');

const app = express();

//  MIDDLEWARES GLOBALES

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//  RUTAS
app.use('/', require('./routes'));

// MANEJO DE ERRORES (siempre al final)

// 404 - Ruta que no existe
app.use((req, res) => {
    res.status(404).json({ ok: false, mensaje: "Ruta no encontrada" });
});

// 500 - Error inesperado del servidor
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ ok: false, mensaje: "Algo salió mal. Intenta de nuevo más tarde." });
});


// ARRANQUE DEL SERVIDOR

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});