function loadProductos() {
    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');
    if (!usuario || !clave) return;

    const url = `/api/productos?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => mostrarProductos(data))
        .catch(error => console.error('❌ Error al cargar productos:', error));
}

function mostrarProductos(productos) {
    if (!Array.isArray(productos)) {
        productos = productos.rows || productos.data || [];
    }

    const tabla = document.getElementById('productos-list');
    tabla.innerHTML = '';

    productos.forEach(p => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${p.PRODUCTO}</td>
            <td>${p.NOMBRE}</td>
            <td>${p.CATEGORIA}</td>
            <td>${p.MARCA}</td>
            <td>${p.PRECIO_COSTO}</td>
            <td>${p.PRECIO_VENTA}</td>
            <td>${p.EXISTENCIA}</td>
            <td>${p.GARANTIA}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarProducto(${p.PRODUCTO})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${p.PRODUCTO})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function eliminarProducto(id) {
    if (!confirm('¿Seguro que desea eliminar este producto?')) return;

    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    fetch(`/api/productos/delete/${id}?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(async response => {
        let data = null;
        try { data = await response.json(); } catch (e) {}
        if (!response.ok || (data && data.success === false)) {
            throw new Error(data?.error || 'Error al eliminar producto');
        }
        loadProductos();
    })
    .catch(error => {
        console.error('❌ Error:', error.message);
        alert(error.message || 'Error al eliminar producto');
    });
}

function editarProducto(id) {
    window.location.href = `upd_producto.html?id=${id}`;
}

document.addEventListener('DOMContentLoaded', loadProductos);