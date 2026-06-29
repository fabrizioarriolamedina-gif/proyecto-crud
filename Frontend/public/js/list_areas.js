// list_areas.js

// Función para cargar las áreas desde el backend
function loadAreas() {
    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    if (!usuario || !clave) {
        console.error('Usuario o clave no definidos en sessionStorage');
        return;
    }

    const url = `/api/areas?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las áreas');
            }
            return response.json();
        })
        .then(data => {
            mostrarAreas(data);
        })
        .catch(error => {
            console.error('❌ Error al cargar áreas:', error);
        });
}

// Función para mostrar las áreas en la tabla
function mostrarAreas(areas) {

    if (!Array.isArray(areas)) {
        areas = areas.rows || areas.data || [];
    }


    const tabla = document.getElementById('areas-list');
    tabla.innerHTML = '';

    areas.forEach(area => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${area.AREA}</td>
            <td>${area.NOMBRE}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarArea(${area.AREA})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarArea(${area.AREA})">Eliminar</button>
            </td>
        `;

        tabla.appendChild(fila);
    });

}


// Función para eliminar un área
function eliminarArea(id) {
    if (!confirm('¿Seguro que desea eliminar esta área?')) return;

    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    if (!usuario || !clave) {
        console.error('Usuario o clave no definidos en sessionStorage');
        return;
    }

    const url = `/api/areas/delete/${id}?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async response => {
        let data = null;
        try {
            data = await response.json();
        } catch (e) {
            // por si la respuesta no tiene JSON válido
        }
        //manejo de errores que vienen del backend
        if (!response.ok || (data && data.success === false)) {
            const msg = data?.error || 'Error al eliminar área';
            throw new Error(msg);
        }

        console.log('✅ Área eliminada:', data);
        loadAreas();
    })
    .catch(error => {
        console.error('❌ Error al eliminar área:', error.message || error);
        alert(error.message || 'Error al eliminar área'); // opcional
    });
}

function editarArea(id) {
    window.location.href = `upd_area.html?id=${id}`;
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', loadAreas);
