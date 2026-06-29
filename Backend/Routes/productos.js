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

// GET /api/productos
router.get('/', async (req, res) => {
    const { usuario, clave } = req.query;
    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            connection.query('SELECT P.PRODUCTO, P.NOMBRE, C.NOMBRE AS CATEGORIA, M.NOMBRE AS MARCA, P.PRECIO_COSTO, P.PRECIO_VENTA, P.FECHA_ADQUISICION, P.GARANTIA, P.EXISTENCIA FROM PRODUCTOS P JOIN CATEGORIAS C ON P.CATEGORIA = C.CATEGORIA JOIN MARCAS M ON P.MARCA = M.MARCA ORDER BY P.NOMBRE', (err, result) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'consultar los productos');
                return res.json(result);
            });
        });
    } catch (err) {
        return manejarError(err, res, 'consultar los productos');
    }
});

// GET /api/productos/producto/:id
router.get('/producto/:id', async (req, res) => {
    const { id } = req.params;
    const { usuario, clave } = req.query;
    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            connection.query(`SELECT * FROM PRODUCTOS WHERE PRODUCTO = ${id}`, (err, result) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'consultar el producto');
                if (result.length > 0) {
                    return res.json({ success: true, producto: result[0] });
                } else {
                    return res.json({ success: false, error: 'Producto no encontrado.' });
                }
            });
        });
    } catch (err) {
        return manejarError(err, res, 'consultar el producto');
    }
});

// GET /api/productos/categorias
router.get('/categorias', async (req, res) => {
    const { usuario, clave } = req.query;
    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            connection.query('SELECT * FROM CATEGORIAS ORDER BY NOMBRE', (err, result) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'consultar las categorías');
                return res.json(result);
            });
        });
    } catch (err) {
        return manejarError(err, res, 'consultar las categorías');
    }
});

// GET /api/productos/marcas
router.get('/marcas', async (req, res) => {
    const { usuario, clave } = req.query;
    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            connection.query('SELECT * FROM MARCAS ORDER BY NOMBRE', (err, result) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'consultar las marcas');
                return res.json(result);
            });
        });
    } catch (err) {
        return manejarError(err, res, 'consultar las marcas');
    }
});

// POST /api/productos/add
router.post('/add', async (req, res) => {
    const { nombre, categoria, marca, garantia, usuario, clave } = req.body;
    if (!usuario || !clave || !nombre || !categoria || !marca) {
        return res.status(400).json({ success: false, error: 'Faltan datos.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            const sql = `INSERT INTO PRODUCTOS (NOMBRE, CATEGORIA, MARCA, GARANTIA) VALUES ('${nombre}', ${categoria}, ${marca}, '${garantia}')`;
            connection.query(sql, (err) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'agregar el producto');
                return res.json({ success: true });
            });
        });
    } catch (err) {
        return manejarError(err, res, 'agregar el producto');
    }
});

// POST /api/productos/update/:id
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, categoria, marca, garantia, usuario, clave } = req.body;
    if (!usuario || !clave || !nombre || !categoria || !marca) {
        return res.status(400).json({ success: false, error: 'Faltan datos.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return res.status(500).json({ success: false, error: 'Error de conexión.' });
            const sql = `UPDATE PRODUCTOS SET NOMBRE = '${nombre}', CATEGORIA = ${categoria}, MARCA = ${marca}, GARANTIA = '${garantia}' WHERE PRODUCTO = ${id}`;
            connection.query(sql, (err) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'actualizar el producto');
                return res.json({ success: true });
            });
        });
    } catch (err) {
        return manejarError(err, res, 'actualizar el producto');
    }
});

// DELETE /api/productos/delete/:id
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { usuario, clave } = req.query;
    if (!usuario || !clave) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales.' });
    }
    try {
        const connection = await getConnection(usuario, clave);
        connection.connect((err) => {
            if (err) return manejarError(err, res, 'conectar para eliminar producto');
            const sql = `DELETE FROM PRODUCTOS WHERE PRODUCTO = ${id}`;
            connection.query(sql, (err) => {
                connection.disconnect();
                if (err) return manejarError(err, res, 'eliminar producto');
                return res.json({ success: true });
            });
        });
    } catch (err) {
        return manejarError(err, res, 'eliminar producto');
    }
});

module.exports = router;