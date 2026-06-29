const urlParams = new URLSearchParams(window.location.search);
const compraId = urlParams.get('id');

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
            loadCompra();
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

function loadCompra() {
    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    fetch(`/api/compras/compra/${compraId}?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`)
        .then(r => r.json())
        .then(data => {
            if (!data.success) throw new Error(data.error);
            const c = data.compra;
            document.getElementById('compra-id').value = c.COMPRA;
            document.getElementById('producto').value = c.PRODUCTO;
            document.getElementById('empleado').value = c.EMPLEADO;
            document.getElementById('proveedor').value = c.PROVEEDOR;
            document.getElementById('fecha').value = c.FECHA;
            document.getElementById('cantidad').value = c.CANTIDAD;
            document.getElementById('precio_costo').value = c.PRECIO_COSTO;
        })
        .catch(error => {
            document.getElementById('error-message').classList.remove('d-none');
            document.getElementById('error-message').textContent = error.message;
        });
}

document.getElementById('upd-compra-form').addEventListener('submit', function (e) {
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

    fetch(`/api/compras/update/${compraId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(async response => {
        let data = null;
        try { data = await response.json(); } catch (e) {}
        if (!response.ok || (data && data.success === false)) {
            throw new Error(data?.error || 'Error al actualizar compra');
        }
        alert('✅ Compra actualizada correctamente');
        window.location.href = 'list_compras.html';
    })
    .catch(error => {
        document.getElementById('error-message').classList.remove('d-none');
        document.getElementById('error-message').textContent = error.message;
    });
});

document.addEventListener('DOMContentLoaded', loadCombos);