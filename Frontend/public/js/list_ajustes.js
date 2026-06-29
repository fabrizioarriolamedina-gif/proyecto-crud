function loadAjustes() {
    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');
    if (!usuario || !clave) return;

    const url = `/api/ajustes?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => mostrarAjustes(data))
        .catch(error => console.error('❌ Error al cargar ajustes:', error));
}

function mostrarAjustes(ajustes) {
    if (!Array.isArray(ajustes)) {
        ajustes = ajustes.rows || ajustes.data || [];
    }

    const tabla = document.getElementById('ajustes-list');
    tabla.innerHTML = '';

    ajustes.forEach(a => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${a.AJUSTE}</td>
            <td>${a.PRODUCTO}</td>
            <td>${a.EMPLEADO}</td>
            <td>${a.FECHA}</td>
            <td>${a.TIPO_AJUSTE === 'E' ? 'Entrada' : 'Salida'}</td>
            <td>${a.CANTIDAD}</td>
            <td>${a.PRECIO_COSTO}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarAjuste(${a.AJUSTE})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarAjuste(${a.AJUSTE})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function eliminarAjuste(id) {
    if (!confirm('¿Seguro que desea eliminar este ajuste?')) return;

    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    fetch(`/api/ajustes/delete/${id}?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(async response => {
        let data = null;
        try { data = await response.json(); } catch (e) {}
        if (!response.ok || (data && data.success === false)) {
            throw new Error(data?.error || 'Error al eliminar ajuste');
        }
        loadAjustes();
    })
    .catch(error => {
        console.error('❌ Error:', error.message);
        alert(error.message || 'Error al eliminar ajuste');
    });
}

function editarAjuste(id) {
    window.location.href = `upd_ajuste.html?id=${id}`;
}

document.addEventListener('DOMContentLoaded', loadAjustes);