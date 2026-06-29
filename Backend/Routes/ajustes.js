const express = require('express');
const Sybase = require('sybase');
const router = express.Router();

async function getConnection(usuario, clave) {
    const connection = new Sybase('localhost', 2638, 'prog4', usuario, clave);
    return connection;
}

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

// GET /api/ajustes
router.get('/', async (req, res) => {
    const { usuario, clave } = req.query;
    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            connection.query(`
                SELECT A.AJUSTE, P.NOMBRE AS PRODUCTO, E.NOMBRE || ' ' || E.APELLIDO AS EMPLEADO,
                A.FECHA, A.TIPO_AJUSTE, A.CANTIDAD, A.PRECIO_COSTO
                FROM AJUSTES A
                JOIN PRODUCTOS P ON A.PRODUCTO = P.PRODUCTO
                JOIN EMPLEADOS E ON A.EMPLEADO = E.EMPLEADO
                ORDER BY A.FECHA DESC
            `, (err, result) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'consultar los ajustes');
                return res.json(result);
            });
        });
    } catch (err) {
        return manejarError(err, res, 'consultar los ajustes');
    }
});

// GET /api/ajustes/ajuste/:id
router.get('/ajuste/:id', async (req, res) => {
    const { id } = req.params;
    const { usuario, clave } = req.query;
    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            connection.query(`SELECT * FROM AJUSTES WHERE AJUSTE = ${id}`, (err, result) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'consultar el ajuste');
                if (result.length > 0) {
                    return res.json({ success: true, ajuste: result[0] });
                } else {
                    return res.json({ success: false, error: 'Ajuste no encontrado.' });
                }
            });
        });
    } catch (err) {
        return manejarError(err, res, 'consultar el ajuste');
    }
});

// GET /api/ajustes/empleados
router.get('/empleados', async (req, res) => {
    const { usuario, clave } = req.query;
    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            connection.query('SELECT EMPLEADO, NOMBRE, APELLIDO FROM EMPLEADOS ORDER BY NOMBRE', (err, result) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'consultar los empleados');
                return res.json(result);
            });
        });
    } catch (err) {
        return manejarError(err, res, 'consultar los empleados');
    }
});

// GET /api/ajustes/productos
router.get('/productos', async (req, res) => {
    const { usuario, clave } = req.query;
    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            connection.query('SELECT PRODUCTO, NOMBRE FROM PRODUCTOS ORDER BY NOMBRE', (err, result) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'consultar los productos');
                return res.json(result);
            });
        });
    } catch (err) {
        return manejarError(err, res, 'consultar los productos');
    }
});

// POST /api/ajustes/add
router.post('/add', async (req, res) => {
    const { producto, empleado, fecha, tipo_ajuste, cantidad, precio_costo, usuario, clave } = req.body;
    if (!usuario || !clave || !producto || !empleado || !fecha || !tipo_ajuste || !cantidad || !precio_costo) {
        return res.status(400).json({ success: false, error: 'Faltan datos.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            const sql = `INSERT INTO AJUSTES (PRODUCTO, EMPLEADO, FECHA, TIPO_AJUSTE, CANTIDAD, PRECIO_COSTO) VALUES (${producto}, ${empleado}, '${fecha}', '${tipo_ajuste}', ${cantidad}, ${precio_costo})`;
            connection.query(sql, (err) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'agregar el ajuste');
                return res.json({ success: true });
            });
        });
    } catch (err) {
        return manejarError(err, res, 'agregar el ajuste');
    }
});

// POST /api/ajustes/update/:id
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { producto, empleado, fecha, tipo_ajuste, cantidad, precio_costo, usuario, clave } = req.body;
    if (!usuario || !clave || !producto || !empleado || !fecha || !tipo_ajuste || !cantidad || !precio_costo) {
        return res.status(400).json({ success: false, error: 'Faltan datos.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            const sql = `UPDATE AJUSTES SET PRODUCTO = ${producto}, EMPLEADO = ${empleado}, FECHA = '${fecha}', TIPO_AJUSTE = '${tipo_ajuste}', CANTIDAD = ${cantidad}, PRECIO_COSTO = ${precio_costo} WHERE AJUSTE = ${id}`;
            connection.query(sql, (err) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'actualizar el ajuste');
                return res.json({ success: true });
            });
        });
    } catch (err) {
        return manejarError(err, res, 'actualizar el ajuste');
    }
});

// DELETE /api/ajustes/delete/:id
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { usuario, clave } = req.query;
    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return manejarError(err, res, 'conectar para eliminar ajuste');
            const sql = `DELETE FROM AJUSTES WHERE AJUSTE = ${id}`;
            connection.query(sql, (err) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'eliminar ajuste');
                return res.json({ success: true });
            });
        });
    } catch (err) {
        return manejarError(err, res, 'eliminar ajuste');
    }
});

module.exports = router;