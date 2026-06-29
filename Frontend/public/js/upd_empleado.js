// upd_empleado.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-empleado-form');
    const errorMessage = document.getElementById('error-message');

    const urlParams = new URLSearchParams(window.location.search);
    const empleadoId = urlParams.get('id');

    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    // Cargar lista de países
    const loadCountries = () => {
        fetch(`/api/paises?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`)
            .then(async response => {
                let data = null;
                try {
                    data = await response.json();
                } catch (e) {}

                if (!response.ok || !data || data.success === false) {
                    const msg = data?.error || 'Error al cargar la lista de países.';
                    throw new Error(msg);
                }

                const paisSelect = document.getElementById('pais');
                data.paises.forEach(pais => {
                    const option = document.createElement('option');
                    option.value = pais.PAIS;
                    option.textContent = pais.NOMBRE;
                    paisSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar países:', error);
                errorMessage.textContent = error.message || 'Error al cargar la lista de países.';
            });
    };

    // Cargar lista de áreas (mismo criterio que en add_empleado.js)
    const loadAreas = () => {
        fetch(`/api/areas?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`)
            .then(async response => {
                let data = null;
                try {
                    data = await response.json();
                } catch (e) {}

                if (!response.ok) {
                    const msg = data?.error || 'Error al cargar la lista de áreas.';
                    throw new Error(msg);
                }

                let areas = data;
                if (!Array.isArray(areas)) {
                    areas = areas?.rows || areas?.data || [];
                }

                const areaSelect = document.getElementById('area');
                areas.forEach(area => {
                    const option = document.createElement('option');
                    option.value = area.AREA;
                    option.textContent = area.NOMBRE;
                    areaSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar áreas:', error);
                errorMessage.textContent = error.message || 'Error al cargar la lista de áreas.';
            });
    };

    // Cargar combos al inicio
    loadCountries();
    loadAreas();

    // Cargar datos del empleado
    if (empleadoId) {
        fetch(`/api/empleados/${encodeURIComponent(empleadoId)}?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`)
            .then(async response => {
                const data = await response.json().catch(() => null);

                if (!response.ok || !data || data.success === false || !data.empleado) {
                    const msg = data?.error || 'Empleado no encontrado.';
                    throw new Error(msg);
                }

                const emp = data.empleado;
                document.getElementById('nombre').value = emp.NOMBRE;
                document.getElementById('apellido').value = emp.APELLIDO;
                document.getElementById('direccion').value = emp.DIRECCION;
                document.getElementById('pais').value = emp.PAIS;
                document.getElementById('telefono').value = emp.TELEFONO;
                document.getElementById('email').value = emp.EMAIL;
                document.getElementById('area').value = emp.AREA;
                document.getElementById('fecha_ingreso').value = emp.FECHA_INGRESO;
                document.getElementById('fecha_salida').value = emp.FECHA_SALIDA || '';
                document.getElementById('salario').value = emp.SALARIO;
            })
            .catch(error => {
                console.error('Error al obtener datos del empleado:', error);
                errorMessage.textContent = error.message || 'Error al obtener datos del empleado.';
            });
    } else {
        errorMessage.textContent = 'Falta el ID del empleado en la URL.';
    }

    // Submit actualización
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        errorMessage.textContent = '';

        const updatedEmpleadoData = {
            usuario,
            clave,
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            direccion: document.getElementById('direccion').value.trim(),
            pais: document.getElementById('pais').value,
            telefono: document.getElementById('telefono').value.trim(),
            email: document.getElementById('email').value.trim(),
            area: document.getElementById('area').value,
            fecha_ingreso: document.getElementById('fecha_ingreso').value,
            fecha_salida: document.getElementById('fecha_salida').value || null,
            salario: document.getElementById('salario').value
        };

        fetch(`/api/empleados/update/${encodeURIComponent(empleadoId)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEmpleadoData)
        })
        .then(async response => {
            const data = await response.json().catch(() => null);

            if (!response.ok || !data || data.success === false) {
                const msg = data?.error || 'Error al actualizar el empleado.';
                throw new Error(msg);
            }

            window.location.href = '/list_empleados.html';
        })
        .catch(error => {
            console.error('Error al actualizar empleado:', error);
            errorMessage.textContent = error.message || 'Error en la conexión con el servidor.';
        });
    });
});
