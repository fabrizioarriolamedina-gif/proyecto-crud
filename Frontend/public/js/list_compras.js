function loadCompras() {
    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');
    if (!usuario || !clave) return;

    const url = `/api/compras?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => mostrarCompras(data))
        .catch(error => console.error('❌ Error al cargar compras:', error));
}

function mostrarCompras(compras) {
    if (!Array.isArray(compras)) {
        compras = compras.rows || compras.data || [];
    }

    const tabla = document.getElementById('compras-list');
    tabla.innerHTML = '';

    compras.forEach(c => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${c.COMPRA}</td>
            <td>${c.PRODUCTO}</td>
            <td>${c.EMPLEADO}</td>
            <td>${c.PROVEEDOR}</td>
            <td>${c.FECHA}</td>
            <td>${c.CANTIDAD}</td>
            <td>${c.PRECIO_COSTO}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarCompra(${c.COMPRA})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarCompra(${c.COMPRA})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function eliminarCompra(id) {
    if (!confirm('¿Seguro que desea eliminar esta compra?')) return;

    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    fetch(`/api/compras/delete/${id}?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(async response => {
        let data = null;
        try { data = await response.json(); } catch (e) {}
        if (!response.ok || (data && data.success === false)) {
            throw new Error(data?.error || 'Error al eliminar compra');
        }
        loadCompras();
    })
    .catch(error => {
        console.error('❌ Error:', error.message);
        alert(error.message || 'Error al eliminar compra');
    });
}

function editarCompra(id) {
    window.location.href = `upd_compra.html?id=${id}`;
}

document.addEventListener('DOMContentLoaded', loadCompras);