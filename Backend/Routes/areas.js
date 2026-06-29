const express = require('express');
const Sybase = require('sybase');
const router = express.Router();

// Función para obtener conexión Sybase
async function getConnection(usuario, clave) {
    const connection = new Sybase('localhost', 2638, 'prog4', usuario, clave);
    return connection;
}

// Función para manejo de errores de base de datos
// *** MODIFICACIÓN ***
const manejarError = (err, res, action) => {
    let errorMessage;

    if (err && typeof err === 'object') {                                       // Si trae err y es un objeto porque Sybase lo trae como objeto y no como string
        errorMessage = err.message || JSON.stringify(err);                      // Sybase normalmente trae err.message y viene en inglés
    } else {
        errorMessage = String(err || 'Error de Base de Datos Desconocido');     // Si no trae err.message
    }

    console.error(`Error al ${action}:`, err);                                  // log completo en servidor
    return res.status(500).json({
        success: false,
        error: `Error de base de datos al ${action}: ${errorMessage}`
    });
};

// GET /api/areas
router.get('/', async (req, res) => {
    const { usuario, clave } = req.query;
    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }

    try {
        const connection = await getConnection(usuario, clave);

        connection.connect(async (err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });

            connection.query('SELECT * FROM AREAS ORDER BY NOMBRE', async (err, result) => {
                if (err) return manejarError(err, res, 'consultar las áreas');                      //llama la la funcion de manejo de errores

                connection.disconnect();
                return res.json(result);
            });
        });

    } catch (err) {
        return manejarError(err, res, 'consultar las áreas');              //llama la la funcion de manejo de errores
        /*
        console.error('❌ Error en GET /areas:', err);
        res.status(500).json({ success: false, error: 'Error al consultar las áreas.' });
        */
    }
});

// GET /area/:id
router.get('/area/:id', async (req, res) => {
    const { id } = req.params;
    const { usuario, clave } = req.query;

    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }

    try {
        const connection = await getConnection(usuario, clave);

        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });

            connection.query(`SELECT * FROM AREAS WHERE AREA = ${id}`, (err, result) => {
                connection.disconnect();

                if (err) return manejarError(err, res, 'consultar las áreas');              //llama la la funcion de manejo de errores

                if (result.length > 0) {
                    return res.json({ success: true, area: result[0] });
                } else {
                    return res.json({ success: false, error: 'Área no encontrada.' });
                }
            });
        });

    } catch (err) {
        return manejarError(err, res, 'consultar las áreas');              //llama la la funcion de manejo de errores
        /*
        console.error('❌ Error en GET /area/:id:', err);
        res.status(500).json({ success: false, error: 'Error al obtener el área.' });
        */
    }
});

// POST /add
router.post('/add', async (req, res) => {
    const { nombre, usuario, clave } = req.body;

    if (!usuario || !clave || !nombre) {
        return res.status(400).json({ success: false, error: 'Faltan datos.' });
    }

    try {
        const connection = await getConnection(usuario, clave);

        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });

            const sql = `INSERT INTO AREAS (NOMBRE) VALUES ('${nombre}')`;

            connection.query(sql, (err) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'agregar las áreas');              //llama la la funcion de manejo de errores
                return res.json({ success: true });
            });
        });

    } catch (err) {
        return manejarError(err, res, 'agregar las áreas');              //llama la la funcion de manejo de errores
        /*
        console.error('❌ Error en POST /add:', err);
        res.status(500).json({ success: false, error: 'Error al agregar área.' });
        */
    }
});

// POST /update/:id
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, usuario, clave } = req.body;

    if (!usuario || !clave || !nombre) {
        return res.status(400).json({ success: false, error: 'Faltan datos.' });
    }

    try {
        const connection = await getConnection(usuario, clave);

        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });

            const sql = `UPDATE AREAS SET NOMBRE = '${nombre}' WHERE AREA = ${id}`;

            connection.query(sql, (err) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'actualizar las áreas');              //llama la la funcion de manejo de errores
                return res.json({ success: true });
            });
        });

    } catch (err) {
        return manejarError(err, res, 'actualizar las áreas');              //llama la la funcion de manejo de errores
        /*
        console.error('❌ Error en POST /update:', err);
        res.status(500).json({ success: false, error: 'Error al actualizar área.' });
        */
    }
});

// DELETE /delete/:id
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { usuario, clave } = req.query;

    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }

    try {
        const connection = await getConnection(usuario, clave);

        connection.connect((err) => {
            if (err) return manejarError(err, res, 'conectar para eliminar área');      

            const sql = `DELETE FROM AREAS WHERE AREA = ${id}`;                         

            connection.query(sql, (err) => {                                            // Ejecutamos la consulta
                connection.disconnect();                                                // Desconectamos

                if (err) {                                                              // Si hay error
                    return manejarError(err, res, 'eliminar área');                     // Llamamos a la funcion de manejo de errores   
                }

                return res.json({ success: true });                                     // Si no hay error
            });
        });

    } catch (err) {
        return manejarError(err, res, 'eliminar área');     
    }
});


module.exports = router;
