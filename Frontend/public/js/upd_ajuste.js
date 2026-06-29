const urlParams = new URLSearchParams(window.location.search);
const ajusteId = urlParams.get('id');

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
            loadAjuste();
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

function loadAjuste() {
    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    fetch(`/api/ajustes/ajuste/${ajusteId}?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`)
        .then(r => r.json())
        .then(data => {
            if (!data.success) throw new Error(data.error);
            const a = data.ajuste;
            document.getElementById('ajuste-id').value = a.AJUSTE;
            document.getElementById('producto').value = a.PRODUCTO;
            document.getElementById('empleado').value = a.EMPLEADO;
            document.getElementById('fecha').value = a.FECHA ? a.FECHA.substring(0, 10) : '';
            document.getElementById('tipo_ajuste').value = a.TIPO_AJUSTE;
            document.getElementById('cantidad').value = a.CANTIDAD;
            document.getElementById('precio_costo').value = a.PRECIO_COSTO;
        })
        .catch(error => {
            document.getElementById('error-message').classList.remove('d-none');
            document.getElementById('error-message').textContent = error.message;
        });
}

document.getElementById('upd-ajuste-form').addEventListener('submit', function (e) {
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

    fetch(`/api/ajustes/update/${ajusteId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(async response => {
        let data = null;
        try { data = await response.json(); } catch (e) {}
        if (!response.ok || (data && data.success === false)) {
            throw new Error(data?.error || 'Error al actualizar ajuste');
        }
        alert('✅ Ajuste actualizado correctamente');
        window.location.href = 'list_ajustes.html';
    })
    .catch(error => {
        document.getElementById('error-message').classList.remove('d-none');
        document.getElementById('error-message').textContent = error.message;
    });
});

document.addEventListener('DOMContentLoaded', loadCombos);