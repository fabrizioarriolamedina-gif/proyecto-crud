// list_empleados.js

document.addEventListener('DOMContentLoaded', function () {
    const empleadosList = document.getElementById('empleados-list');
    const errorMessage = document.getElementById('error-message');

    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    if (!usuario || !clave) {
        console.error('Usuario o clave no definidos en sessionStorage');
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Faltan credenciales en la sesión.';
        }
        return;
    }

    function loadEmpleados() {
        const url = `/api/empleados?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`;

        fetch(url)
            .then(async response => {
                let data = null;
                try {
                    data = await response.json();
                } catch (e) {}

                if (!response.ok) {
                    const msg = data?.error || 'Error al obtener los empleados.';
                    throw new Error(msg);
                }

                // /api/empleados devuelve un array directo
                let empleados = data;
                if (!Array.isArray(empleados)) {
                    empleados = empleados?.rows || empleados?.data || [];
                }

                mostrarEmpleados(empleados);
            })
            .catch(error => {
                console.error('Error al cargar empleados:', error);
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                    errorMessage.textContent = error.message || 'Error al cargar empleados.';
                } else {
                    alert(error.message || 'Error al cargar empleados.');
                }
            });
    }

    function mostrarEmpleados(empleados) {
        empleadosList.innerHTML = empleados.map(empleado => `
            <tr>
                <td>${empleado.EMPLEADO}</td>
                <td>${empleado.NOMBRE}</td>
                <td>${empleado.APELLIDO}</td>
                <td>${empleado.DIRECCION}</td>
                <td>${empleado.TELEFONO}</td>
                <td>${empleado.EMAIL}</td>
                <td>
                    <button onclick="editEmpleado(${empleado.EMPLEADO})">Actualizar</button>
                    <button onclick="confirmDelete(${empleado.EMPLEADO})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    }

    // Exponer funciones al scope global para onclick del HTML
    window.editEmpleado = function (id) {
        window.location.href = `upd_empleado.html?id=${id}`;
    };

    window.confirmDelete = function (id) {
        if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
            deleteEmpleado(id);
        }
    };

    function deleteEmpleado(id) {
        const url = `/api/empleados/delete/${id}?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`;

        fetch(url, { method: 'DELETE' })
            .then(async response => {
                let data = null;
                try {
                    data = await response.json();
                } catch (e) {}

                if (!response.ok || (data && data.success === false)) {
                    const msg = data?.error || 'Error al eliminar el empleado.';
                    throw new Error(msg);
                }

                loadEmpleados();
            })
            .catch(error => {
                console.error('Error al eliminar empleado:', error);
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                    errorMessage.textContent = error.message || 'Error al eliminar el empleado.';
                } else {
                    alert(error.message || 'Error al eliminar el empleado.');
                }
            });
    }

    loadEmpleados();
});
