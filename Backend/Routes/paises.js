// paises.js
const express = require('express');
const Sybase = require('sybase');
const router = express.Router();

// ===============================
// Conexión Sybase (igual que areas.js)
// ===============================
async function getConnection(usuario, clave) {
    const connection = new Sybase('localhost', 2638, 'prog4', usuario, clave);
    return connection;
}

// ===============================
// Manejo de errores (MISMO que areas.js)
// ===============================
const manejarError = (err, res, action) => {
    let errorMessage;

    if (err && typeof err === 'object') {                     // Sybase trae err como objeto
        errorMessage = err.message || JSON.stringify(err);    // Normalmente err.message (en inglés)
    } else {
        errorMessage = String(err || 'Error de Base de Datos Desconocido');
    }

    console.error(`Error al ${action}:`, err);                // Log completo en servidor
    return res.status(500).json({
        success: false,
        error: `Error de base de datos al ${action}: ${errorMessage}`
    });
};

// ===============================
// GET /api/paises
// Devuelve: { success:true, paises:[...] }
// ===============================
router.get('/', async (req, res) => {
    const { usuario, clave } = req.query;

    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }

    try {
        const connection = await getConnection(usuario, clave);

        connection.connect((err) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Error de conexión.' });
            }

            const sql = 'SELECT PAIS, NOMBRE FROM PAISES ORDER BY NOMBRE';

            connection.query(sql, (err, result) => {
                connection.disconnect();

                if (err) {
                    return manejarError(err, res, 'consultar los países');
                }

                // RESPUESTA esperada por add_empleado.js y upd_empleado.js:
                // { success:true, paises:[{PAIS,...}] }
                return res.json({
                    success: true,
                    paises: result
                });
            });
        });
    } catch (err) {
        return manejarError(err, res, 'consultar los países');
    }
});

module.exports = router;
