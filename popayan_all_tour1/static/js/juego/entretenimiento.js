/*  =========  NAVBAR & MENÚ HAMBURGUESA  =========  */
document.addEventListener("DOMContentLoaded", () => {
  /* --- Menú hamburguesa --- */
  const hamburger = document.getElementById("hamburger");
  const navMenu   = document.getElementById("nav-menu");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("show");     // abre / cierra el menú
  });

  /* --- Ocultar / mostrar navbar al hacer scroll --- */
  const navbar       = document.getElementById("navbar");
  let prevScrollPos  = window.pageYOffset;

  window.addEventListener("scroll", () => {
    const currentScrollPos = window.pageYOffset;

    // Al subir, mostramos; al bajar, escondemos
    navbar.style.top = (prevScrollPos > currentScrollPos) ? "0px" : "-100px";

    prevScrollPos = currentScrollPos;
  });
});
