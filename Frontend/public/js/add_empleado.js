// add_empleado.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-empleado-form');
    const errorMessage = document.getElementById('error-message');

    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    // Cargar lista de países (igual patrón que áreas)
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

    // Cargar lista de áreas (igual que list_areas.js: /api/areas devuelve array pelado)
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

    // Llamar a las funciones para cargar países y áreas
    loadCountries();
    loadAreas();

    // Procesar el formulario (mismo patrón que add_area.js)
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        errorMessage.textContent = '';

        const empleadoData = {
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

        fetch('/api/empleados/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(empleadoData)
        })
        .then(async response => {
            let data = null;
            try {
                data = await response.json();
            } catch (e) {}

            if (!response.ok || !data || data.success === false) {
                const msg = data?.error || 'Error al agregar el empleado.';
                throw new Error(msg);
            }

            window.location.href = '/list_empleados.html';
        })
        .catch(error => {
            console.error('Error al agregar empleado:', error);
            errorMessage.textContent = error.message || 'Error en la conexión con el servidor.';
        });
    });
});
