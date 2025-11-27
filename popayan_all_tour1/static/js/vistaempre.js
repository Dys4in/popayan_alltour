document.addEventListener("DOMContentLoaded", () => {
  // --- Referencias ---
  const deleteModal = document.getElementById("deleteModal");
  const logoutModal = document.getElementById("logoutModal");

  const userIcon = document.getElementById("userIcon");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const logoutBtn = document.getElementById("logoutBtn");

  // --- Dropdown Usuario ---
  if (userIcon && dropdownMenu) {
    userIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdownMenu.classList.contains("open");
      document.querySelectorAll(".dropdown.open").forEach(d => d.classList.remove("open"));
      dropdownMenu.classList.toggle("open", !isOpen);
      userIcon.setAttribute("aria-expanded", String(!isOpen));
    });

    // Cerrar dropdown al hacer click fuera
    document.addEventListener("click", (e) => {
      if (!dropdownMenu.contains(e.target) && e.target !== userIcon) {
        dropdownMenu.classList.remove("open");
        userIcon.setAttribute("aria-expanded", "false");
      }
    });
  }

  // --- Abrir modal de Cerrar Sesión ---
  if (logoutBtn && logoutModal) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      dropdownMenu?.classList.remove("open");
      logoutModal.style.display = "block";
    });
  }

  // --- Cerrar modales (logout / delete) por botón X y cancelar ---
  document.querySelectorAll(".modal .close").forEach(btn => {
    btn.addEventListener("click", () => {
      const which = btn.getAttribute("data-close");
      if (which === "logout") logoutModal.style.display = "none";
      if (which === "delete") deleteModal.style.display = "none";
    });
  });

  const cancelLogout = document.getElementById("cancelLogout");
  if (cancelLogout && logoutModal) {
    cancelLogout.addEventListener("click", () => {
      logoutModal.style.display = "none";
    });
  }

  const cancelDelete = document.getElementById("cancelDelete");
  if (cancelDelete && deleteModal) {
    cancelDelete.addEventListener("click", () => {
      deleteModal.style.display = "none";
    });
  }

  // --- Cerrar modales al click fuera ---
  window.addEventListener("click", (event) => {
    if (event.target === logoutModal) logoutModal.style.display = "none";
    if (event.target === deleteModal) deleteModal.style.display = "none";
  });

  // --- Confirmar eliminación (si usas el modal custom) ---
  window.confirmarEliminar = function (hotelId, hotelName) {
    const nameSpan = document.getElementById("hotelName");
    const deleteForm = document.getElementById("deleteForm");
    if (nameSpan) nameSpan.textContent = hotelName;
    if (deleteForm) deleteForm.action = `/empresario/eliminar-hotel/${hotelId}/`;
    if (deleteModal) deleteModal.style.display = "block";
  };
});
