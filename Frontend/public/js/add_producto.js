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

document.getElementById('add-producto-form').addEventListener('submit', function (e) {
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

    fetch('/api/productos/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(async response => {
        let data = null;
        try { data = await response.json(); } catch (e) {}
        if (!response.ok || (data && data.success === false)) {
            throw new Error(data?.error || 'Error al agregar producto');
        }
        alert('✅ Producto agregado correctamente');
        window.location.href = 'list_productos.html';
    })
    .catch(error => {
        document.getElementById('error-message').classList.remove('d-none');
        document.getElementById('error-message').textContent = error.message;
    });
});

document.addEventListener('DOMContentLoaded', loadCombos);