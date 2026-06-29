function loadCombos() {
    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    fetch(`/api/ajustes/productos?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`)
        .then(r => r.json())
        .then(data => {
            const select = document.getElementById('producto');
            data.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.PRODUCTO;
                opt.textContent = p.NOMBRE;
                select.appendChild(opt);
            });
        });

    fetch(`/api/ajustes/empleados?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`)
        .then(r => r.json())
        .then(data => {
            const select = document.getElementById('empleado');
            data.forEach(e => {
                const opt = document.createElement('option');
                opt.value = e.EMPLEADO;
                opt.textContent = e.NOMBRE + ' ' + e.APELLIDO;
                select.appendChild(opt);
            });
        });
}

document.getElementById('add-ajuste-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    const body = {
        producto: document.getElementById('producto').value,
        empleado: document.getElementById('empleado').value,
        fecha: document.getElementById('fecha').value,
        tipo_ajuste: document.getElementById('tipo_ajuste').value,
        cantidad: document.getElementById('cantidad').value,
        precio_costo: document.getElementById('precio_costo').value,
        usuario,
        clave
    };

    fetch('/api/ajustes/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(async response => {
        let data = null;
        try { data = await response.json(); } catch (e) {}
        if (!response.ok || (data && data.success === false)) {
            throw new Error(data?.error || 'Error al agregar ajuste');
        }
        alert('✅ Ajuste agregado correctamente');
        window.location.href = 'list_ajustes.html';
    })
    .catch(error => {
        document.getElementById('error-message').classList.remove('d-none');
        document.getElementById('error-message').textContent = error.message;
    });
});

document.addEventListener('DOMContentLoaded', loadCombos);