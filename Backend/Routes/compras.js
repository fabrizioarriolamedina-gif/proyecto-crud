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

// GET /api/compras
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
                SELECT C.COMPRA, P.NOMBRE AS PRODUCTO, E.NOMBRE || ' ' || E.APELLIDO AS EMPLEADO,
                PR.NOMBRE AS PROVEEDOR, C.FECHA, C.CANTIDAD, C.PRECIO_COSTO
                FROM COMPRAS C
                JOIN PRODUCTOS P ON C.PRODUCTO = P.PRODUCTO
                JOIN EMPLEADOS E ON C.EMPLEADO = E.EMPLEADO
                JOIN PROVEEDORES PR ON C.PROVEEDOR = PR.PROVEEDOR
                ORDER BY C.FECHA DESC
            `, (err, result) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'consultar las compras');
                return res.json(result);
            });
        });
    } catch (err) {
        return manejarError(err, res, 'consultar las compras');
    }
});

// GET /api/compras/compra/:id
router.get('/compra/:id', async (req, res) => {
    const { id } = req.params;
    const { usuario, clave } = req.query;
    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            connection.query(`SELECT * FROM COMPRAS WHERE COMPRA = ${id}`, (err, result) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'consultar la compra');
                if (result.length > 0) {
                    return res.json({ success: true, compra: result[0] });
                } else {
                    return res.json({ success: false, error: 'Compra no encontrada.' });
                }
            });
        });
    } catch (err) {
        return manejarError(err, res, 'consultar la compra');
    }
});

// GET /api/compras/proveedores
router.get('/proveedores', async (req, res) => {
    const { usuario, clave } = req.query;
    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            connection.query('SELECT PROVEEDOR, NOMBRE FROM PROVEEDORES ORDER BY NOMBRE', (err, result) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'consultar los proveedores');
                return res.json(result);
            });
        });
    } catch (err) {
        return manejarError(err, res, 'consultar los proveedores');
    }
});

// GET /api/compras/empleados
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

// GET /api/compras/productos
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

// POST /api/compras/add
router.post('/add', async (req, res) => {
    const { producto, empleado, proveedor, fecha, cantidad, precio_costo, usuario, clave } = req.body;
    if (!usuario || !clave || !producto || !empleado || !proveedor || !fecha || !cantidad || !precio_costo) {
        return res.status(400).json({ success: false, error: 'Faltan datos.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            const sql = `INSERT INTO COMPRAS (PRODUCTO, EMPLEADO, PROVEEDOR, FECHA, CANTIDAD, PRECIO_COSTO) VALUES (${producto}, ${empleado}, ${proveedor}, '${fecha}', ${cantidad}, ${precio_costo})`;
            connection.query(sql, (err) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'agregar la compra');
                return res.json({ success: true });
            });
        });
    } catch (err) {
        return manejarError(err, res, 'agregar la compra');
    }
});

// POST /api/compras/update/:id
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { producto, empleado, proveedor, fecha, cantidad, precio_costo, usuario, clave } = req.body;
    if (!usuario || !clave || !producto || !empleado || !proveedor || !fecha || !cantidad || !precio_costo) {
        return res.status(400).json({ success: false, error: 'Faltan datos.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            const sql = `UPDATE COMPRAS SET PRODUCTO = ${producto}, EMPLEADO = ${empleado}, PROVEEDOR = ${proveedor}, FECHA = '${fecha}', CANTIDAD = ${cantidad}, PRECIO_COSTO = ${precio_costo} WHERE COMPRA = ${id}`;
            connection.query(sql, (err) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'actualizar la compra');
                return res.json({ success: true });
            });
        });
    } catch (err) {
        return manejarError(err, res, 'actualizar la compra');
    }
});

// DELETE /api/compras/delete/:id
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { usuario, clave } = req.query;
    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return manejarError(err, res, 'conectar para eliminar compra');
            const sql = `DELETE FROM COMPRAS WHERE COMPRA = ${id}`;
            connection.query(sql, (err) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'eliminar compra');
                return res.json({ success: true });
            });
        });
    } catch (err) {
        return manejarError(err, res, 'eliminar compra');
    }
});

module.exports = router;