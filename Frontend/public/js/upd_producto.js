const urlParams = new URLSearchParams(window.location.search);
const productoId = urlParams.get('id');

function loadCombos() {
    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    fetch(`/api/productos/categorias?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`)
        .then(r => r.json())
        .then(data => {
            const select = document.getElementById('categoria');
            data.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.CATEGORIA;
                opt.textContent = c.NOMBRE;
                select.appendChild(opt);
            });
            loadProducto();
        });

    fetch(`/api/productos/marcas?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`)
        .then(r => r.json())
        .then(data => {
            const select = document.getElementById('marca');
            data.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.MARCA;
                opt.textContent = m.NOMBRE;
                select.appendChild(opt);
            });
        });
}

function loadProducto() {
    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    fetch(`/api/productos/producto/${productoId}?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(clave)}`)
        .then(r => r.json())
        .then(data => {
            if (!data.success) throw new Error(data.error);
            const p = data.producto;
            document.getElementById('producto-id').value = p.PRODUCTO;
            document.getElementById('nombre').value = p.NOMBRE;
            document.getElementById('categoria').value = p.CATEGORIA;
            document.getElementById('marca').value = p.MARCA;
            document.getElementById('garantia').value = p.GARANTIA;
            // Campos de solo lectura
            document.getElementById('precio_costo').value = p.PRECIO_COSTO;
            document.getElementById('precio_venta').value = p.PRECIO_VENTA;
            document.getElementById('fecha_adquisicion').value = p.FECHA_ADQUISICION;
            document.getElementById('existencia').value = p.EXISTENCIA;
        })
        .catch(error => {
            document.getElementById('error-message').classList.remove('d-none');
            document.getElementById('error-message').textContent = error.message;
        });
}

document.getElementById('upd-producto-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    const body = {
        nombre: document.getElementById('nombre').value,
        categoria: document.getElementById('categoria').value,
        marca: document.getElementById('marca').value,
        garantia: document.getElementById('garantia').value,
        usuario,
        clave
    };

    fetch(`/api/productos/update/${productoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(async response => {
        let data = null;
        try { data = await response.json(); } catch (e) {}
        if (!response.ok || (data && data.success === false)) {
            throw new Error(data?.error || 'Error al actualizar producto');
        }
        alert('✅ Producto actualizado correctamente');
        window.location.href = 'list_productos.html';
    })
    .catch(error => {
        document.getElementById('error-message').classList.remove('d-none');
        document.getElementById('error-message').textContent = error.message;
    });
});

document.addEventListener('DOMContentLoaded', loadCombos);