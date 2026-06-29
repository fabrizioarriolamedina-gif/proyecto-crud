document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formularioActualizar');
    const areaIdInput = document.getElementById('area-id');
    const areaNameInput = document.getElementById('area-name');
    const errorMessage = document.getElementById('error-message');

    const urlParams = new URLSearchParams(window.location.search);
    const areaId = urlParams.get('id');

    const usuario = sessionStorage.getItem('usuario');
    const clave = sessionStorage.getItem('clave');

    if (areaId) {
        areaIdInput.value = areaId;

        fetch(`/api/areas/area/${areaId}?usuario=${usuario}&clave=${clave}`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.area) {
                    areaNameInput.value = data.area.NOMBRE;
                } else {
                    errorMessage.textContent = 'No se encontró el área.';
                }
            })
            .catch(error => {
                errorMessage.textContent = 'Error al obtener el área.';
                console.error('Error:', error);
            });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = areaIdInput.value;
        const nombre = areaNameInput.value;

        try {
            const response = await fetch(`/api/areas/update/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, usuario, clave })
            });

            const resultado = await response.json();

            if (!response.ok || !resultado.success) {
                throw new Error(resultado.error || "Error al actualizar área");
            }

            alert("✅ Área actualizada con éxito");
            window.location.href = "list_areas.html";
        } catch (error) {
            console.error("❌ Error al actualizar área:", error);
            errorMessage.textContent = "❌ Error al actualizar área: " + error.message;
        }
    });
});
