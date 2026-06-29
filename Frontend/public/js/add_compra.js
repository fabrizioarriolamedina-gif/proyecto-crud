function loadCombos() {
    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    fetch(`/api/compras/productos?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`)
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

    fetch(`/api/compras/empleados?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`)
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

    fetch(`/api/compras/proveedores?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`)
        .then(r => r.json())
        .then(data => {
            const select = document.getElementById('proveedor');
            data.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.PROVEEDOR;
                opt.textContent = p.NOMBRE;
                select.appendChild(opt);
            });
        });
}

document.getElementById('add-compra-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    const body = {
        producto: document.getElementById('producto').value,
        empleado: document.getElementById('empleado').value,
        proveedor: document.getElementById('proveedor').value,
        fecha: document.getElementById('fecha').value,
        cantidad: document.getElementById('cantidad').value,
        precio_costo: document.getElementById('precio_costo').value,
        usuario,
        clave
    };

    fetch('/api/compras/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(async response => {
        let data = null;
        try { data = await response.json(); } catch (e) {}
        if (!response.ok || (data && data.success === false)) {
            throw new Error(data?.error || 'Error al agregar compra');
        }
        alert('✅ Compra agregada correctamente');
        window.location.href = 'list_compras.html';
    })
    .catch(error => {
        document.getElementById('error-message').classList.remove('d-none');
        document.getElementById('error-message').textContent = error.message;
    });
});

document.addEventListener('DOMContentLoaded', loadCombos);