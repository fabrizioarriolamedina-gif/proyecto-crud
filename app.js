// app.js - Configuración inicial del servidor
const express = require('express');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(express.json());
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, 'frontend/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/login.html'));
});

app.get('/list_areas', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/list_areas.html'));
});
app.get('/add_area', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/add_area.html'));
});
app.get('/upd_area', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/upd_area.html'));
});
app.get('/list_empleados', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/list_empleados.html'));
});
app.get('/add_empleado', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/add_empleado.html'));
});
app.get('/upd_empleado', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/upd_empleado.html'));
});
app.get('/list_productos', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/list_productos.html'));
});
app.get('/add_producto', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/add_producto.html'));
});
app.get('/upd_producto', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/upd_producto.html'));
});
app.get('/list_compras', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/list_compras.html'));
});
app.get('/add_compra', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/add_compra.html'));
});
app.get('/upd_compra', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/upd_compra.html'));
});
app.get('/list_ajustes', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/list_ajustes.html'));
});
app.get('/add_ajuste', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/add_ajuste.html'));
});
app.get('/upd_ajuste', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/upd_ajuste.html'));
});

const loginRoute = require('./Backend/Routes/login');
app.use('/api/login', loginRoute);

const areasRoute = require('./Backend/Routes/areas');
app.use('/api/areas', areasRoute);

const empleadosRoute = require('./Backend/Routes/empleados');
app.use('/api/empleados', empleadosRoute);

const paisesRoute = require('./Backend/Routes/paises');
app.use('/api/paises', paisesRoute);

const productosRoute = require('./Backend/Routes/productos');
app.use('/api/productos', productosRoute);

const comprasRoute = require('./Backend/Routes/compras');
app.use('/api/compras', comprasRoute);

const ajustesRoute = require('./Backend/Routes/ajustes');
app.use('/api/ajustes', ajustesRoute);

app.listen(PORT, () => {
    console.log(`✅ Servidor iniciado en http://localhost:${PORT}`);
});