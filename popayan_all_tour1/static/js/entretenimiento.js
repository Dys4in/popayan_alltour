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

 
});

window.addEventListener('scroll', function() {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) { // cambia 50 por el número de píxeles que quieras
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
});
