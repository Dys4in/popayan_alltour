document.getElementById('hamburger').addEventListener('click', function() {
  document.getElementById('nav-menu').classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', function() {
    document.getElementById('nav-menu').classList.remove('active');
  });
});

// Navbar scroll
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});