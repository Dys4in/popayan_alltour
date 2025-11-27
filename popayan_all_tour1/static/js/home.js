


document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;
  const totalSlides = slides.length;

  const imageUrls = [
    "/static/img/Home_1.jpg",
    "/static/img/Home_2.jpg",
    "/static/img/Home_3.jpg",
    "/static/img/Home_4.jpg",
    "/static/img/Home_5.jpg",
    "/static/img/Home_6.jpg",
    "/static/img/Home_7.jpg",
    "/static/img/Home_8.jpg"
  ];

  imageUrls.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }, 6000);

  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });

  let prevScrollPos = window.pageYOffset;
  const navbar = document.getElementById("navbar");

  
});
window.addEventListener('scroll', function() {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) { // cambia 50 por el número de píxeles que quieras
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

/* carrousel */

document.addEventListener("DOMContentLoaded", function () {
  const carrusel = document.getElementById('carrusel');
  const carrusel2 = document.getElementById('carrusel2');
  const carrusel3 = document.getElementById('carrusel3');
  const carrusel4 = document.getElementById('carrusel4');
  const slides = carrusel.innerHTML;
  const slides2 = carrusel2.innerHTML;
  const slides3 = carrusel3.innerHTML;
  const slides4 = carrusel4.innerHTML;
carrusel.innerHTML += slides + slides;
carrusel2.innerHTML += slides2 + slides2;
carrusel3.innerHTML += slides3 + slides3;
carrusel4.innerHTML += slides4 + slides4;

  // Modal
  const modal = document.getElementById('modal');
  const imagenAmpliada = document.getElementById('imagenAmpliada');
  const cerrar = document.getElementById('cerrar');


// Aplica el evento a TODAS las clases que comienzan con "slide"
document.querySelectorAll('[class^="slide"]').forEach(slide => {
  const img = slide.querySelector('img');
  if (img) {
    slide.addEventListener('click', () => {
      imagenAmpliada.src = img.src;
      modal.style.display = 'block';
    });
  }
});


    document.querySelectorAll('slide2').forEach(slide => {
    slide.addEventListener('click', () => {
      const imgSrc = slide.querySelector('img').src;
      imagenAmpliada.src = imgSrc;
      modal.style.display = 'block';
    });
  });

  cerrar.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });
});
