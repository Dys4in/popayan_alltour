document.addEventListener("DOMContentLoaded", function () {
    const rolField = document.getElementById("id_rol");
    const tipoEstablecimientoContainer = document.getElementById("tipo_establecimiento-container");
    const tipoEstablecimientoInput = document.getElementById("id_tipo_establecimiento");

    function toggleEstablecimiento() {
        const selectedText = rolField.options[rolField.selectedIndex].text.toLowerCase();
        if (selectedText === "empresario") {
            tipoEstablecimientoContainer.style.display = "block";
            tipoEstablecimientoInput.required = true;
        } else {
            tipoEstablecimientoContainer.style.display = "none";
            tipoEstablecimientoInput.required = false;
            tipoEstablecimientoInput.value = "";
        }
    }

    rolField.addEventListener("change", toggleEstablecimiento);
    toggleEstablecimiento();
});
