// empleados.js
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

    if (err && typeof err === 'object') {
        errorMessage = err.message || JSON.stringify(err);
    } else {
        errorMessage = String(err || 'Error de Base de Datos Desconocido');
    }

    console.error(`Error al ${action}:`, err);
    return res.status(500).json({
        success: false,
        error: `Error de base de datos al ${action}: ${errorMessage}`
    });
};

// ===============================
// GET /api/empleados
// Devuelve: array "pelado" (como /api/areas)
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

            const sql = `
                SELECT EMPLEADO, NOMBRE, APELLIDO, DIRECCION, TELEFONO, EMAIL, AREA, PAIS,
                       FECHA_INGRESO, FECHA_SALIDA, SALARIO
                FROM EMPLEADOS
                ORDER BY EMPLEADO
            `;

            connection.query(sql, (err, result) => {
                connection.disconnect();

                if (err) {
                    return manejarError(err, res, 'consultar los empleados');
                }

                // RESPUESTA: array directo, como /api/areas
                return res.json(result);
            });
        });
    } catch (err) {
        return manejarError(err, res, 'consultar los empleados');
    }
});

// ===============================
// GET /api/empleados/:id
// Devuelve: { success:true, empleado:{...} } o {success:false,error}
// ===============================
router.get('/:id', async (req, res) => {
    const { id } = req.params;
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

            const sql = `
                SELECT EMPLEADO, NOMBRE, APELLIDO, DIRECCION, TELEFONO, EMAIL, AREA, PAIS,
                       FECHA_INGRESO, FECHA_SALIDA, SALARIO
                FROM EMPLEADOS
                WHERE EMPLEADO = ${id}
            `;

            connection.query(sql, (err, result) => {
                connection.disconnect();

                if (err) {
                    return manejarError(err, res, 'consultar los empleados');
                }

                if (result.length > 0) {
                    return res.json({
                        success: true,
                        empleado: result[0]
                    });
                } else {
                    return res.json({
                        success: false,
                        error: 'Empleado no encontrado.'
                    });
                }
            });
        });
    } catch (err) {
        return manejarError(err, res, 'consultar los empleados');
    }
});

// ===============================
// POST /api/empleados/add
// Body: { nombre, apellido, direccion, pais, telefono, email, area, fecha_ingreso, fecha_salida, salario, usuario, clave }
// Devuelve: { success:true } o { success:false,error }
// ===============================
router.post('/add', async (req, res) => {
    const {
        nombre,
        apellido,
        direccion,
        pais,
        telefono,
        email,
        area,
        fecha_ingreso,
        fecha_salida,
        salario,
        usuario,
        clave
    } = req.body;

    if (!usuario || !clave || !nombre || !apellido || !area || !pais) {
        return res.status(400).json({ success: false, error: 'Faltan datos obligatorios.' });
    }

    try {
        const connection = await getConnection(usuario, clave);

        connection.connect((err) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Error de conexión.' });
            }

            const fechaIngresoSql = fecha_ingreso ? `'${fecha_ingreso}'` : 'NULL';
            const fechaSalidaSql  = fecha_salida  ? `'${fecha_salida}'`  : 'NULL';
            const salarioSql      = salario       ? salario              : 0;

            const sql = `
                INSERT INTO EMPLEADOS
                    (NOMBRE, APELLIDO, DIRECCION, PAIS, TELEFONO, EMAIL, AREA, FECHA_INGRESO, FECHA_SALIDA, SALARIO)
                VALUES
                    ('${nombre}', '${apellido}', '${direccion}', ${pais},
                     '${telefono}', '${email}', ${area},
                     ${fechaIngresoSql}, ${fechaSalidaSql}, ${salarioSql})
            `;

            connection.query(sql, (err) => {
                connection.disconnect();

                if (err) {
                    return manejarError(err, res, 'agregar el empleado');
                }

                return res.json({ success: true });
            });
        });
    } catch (err) {
        return manejarError(err, res, 'agregar el empleado');
    }
});

// ===============================
// POST /api/empleados/update/:id
// Body igual que add (sin usuario/clave obligatorios se corta antes)
// ===============================
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const {
        nombre,
        apellido,
        direccion,
        pais,
        telefono,
        email,
        area,
        fecha_ingreso,
        fecha_salida,
        salario,
        usuario,
        clave
    } = req.body;

    if (!usuario || !clave || !nombre || !apellido || !area || !pais) {
        return res.status(400).json({ success: false, error: 'Faltan datos obligatorios.' });
    }

    try {
        const connection = await getConnection(usuario, clave);

        connection.connect((err) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Error de conexión.' });
            }

            const fechaIngresoSql = fecha_ingreso ? `'${fecha_ingreso}'` : 'NULL';
            const fechaSalidaSql  = fecha_salida  ? `'${fecha_salida}'`  : 'NULL';
            const salarioSql      = salario       ? salario              : 0;

            const sql = `
                UPDATE EMPLEADOS
                SET NOMBRE        = '${nombre}',
                    APELLIDO      = '${apellido}',
                    DIRECCION     = '${direccion}',
                    PAIS          = ${pais},
                    TELEFONO      = '${telefono}',
                    EMAIL         = '${email}',
                    AREA          = ${area},
                    FECHA_INGRESO = ${fechaIngresoSql},
                    FECHA_SALIDA  = ${fechaSalidaSql},
                    SALARIO       = ${salarioSql}
                WHERE EMPLEADO = ${id}
            `;

            connection.query(sql, (err) => {
                connection.disconnect();

                if (err) {
                    return manejarError(err, res, 'actualizar el empleado');
                }

                return res.json({ success: true });
            });
        });
    } catch (err) {
        return manejarError(err, res, 'actualizar el empleado');
    }
});

// ===============================
// DELETE /api/empleados/delete/:id
// query: ?usuario=&clave=
// ===============================
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { usuario, clave } = req.query;

    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }

    try {
        const connection = await getConnection(usuario, clave);

        connection.connect((err) => {
            if (err) {
                return manejarError(err, res, 'conectar para eliminar empleado');
            }

            const sql = `DELETE FROM EMPLEADOS WHERE EMPLEADO = ${id}`;

            connection.query(sql, (err) => {
                connection.disconnect();

                if (err) {
                    return manejarError(err, res, 'eliminar el empleado');
                }

                return res.json({ success: true });
            });
        });
    } catch (err) {
        return manejarError(err, res, 'eliminar el empleado');
    }
});

module.exports = router;
