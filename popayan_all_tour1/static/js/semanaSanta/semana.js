// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        hamburger.classList.toggle("active");
    });

    document.querySelectorAll(".nav-menu a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
        });
    });
}





// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// MODAL DE HISTORIA - Variables y funciones para el modal
let currentHistorySlide = 0;

function openHistoryModal() {
    const modal = document.getElementById('historyModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeHistoryModal() {
    const modal = document.getElementById('historyModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function showHistorySlide(index) {
    const modal = document.getElementById('historyModal');
    if (!modal) return;
    
    const slides = modal.querySelectorAll('.carousel-slide');
    const indicators = modal.querySelectorAll('.indicator');
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    if (slides[index] && indicators[index]) {
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentHistorySlide = index;
    }
}

function changeHistorySlide(direction) {
    const modal = document.getElementById('historyModal');
    if (!modal) return;
    
    const slides = modal.querySelectorAll('.carousel-slide');
    let newSlide = currentHistorySlide + direction;
    if (newSlide < 0) newSlide = slides.length - 1;
    if (newSlide >= slides.length) newSlide = 0;
    showHistorySlide(newSlide);
}

function goToHistorySlide(index) {
    showHistorySlide(index);
}

// CARRUSEL DE HISTORIA - Variables y funciones para el carrusel de historia
let historySlideIndex = 1;
let historySlideInterval;

function initHistoryCarousel() {
    showHistorySlide(historySlideIndex);
    startHistoryAutoSlide();
    setupHistoryNavigationEvents();
}

function setupHistoryNavigationEvents() {
    // Event listeners para las flechas del carrusel de historia
    const prevBtn = document.querySelector('#historia .carousel-nav.prev');
    const nextBtn = document.querySelector('#historia .carousel-nav.next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => changeHistorySlide(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => changeHistorySlide(1));
    }
    
    // Event listeners para los puntos del carrusel de historia
    const dots = document.querySelectorAll('#historia .carousel-dots .dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToHistorySlide(index + 1));
    });
}

function changeHistorySlide(direction) {
    historySlideIndex += direction;
    
    const historyCarousel = document.querySelector('#historia');
    if (!historyCarousel) return;
    
    const totalSlides = historyCarousel.querySelectorAll('.carousel-slide').length;
    
    if (historySlideIndex > totalSlides) {
        historySlideIndex = 1;
    } else if (historySlideIndex < 1) {
        historySlideIndex = totalSlides;
    }
    
    showHistorySlide(historySlideIndex);
    resetHistoryAutoSlide();
}

function goToHistorySlide(index) {
    historySlideIndex = index;
    showHistorySlide(historySlideIndex);
    resetHistoryAutoSlide();
}

function showHistorySlide(index) {
    const historyCarousel = document.querySelector('#historia');
    if (!historyCarousel) return;
    
    const slides = historyCarousel.querySelectorAll('.carousel-slide');
    const dots = historyCarousel.querySelectorAll('.dot');
    
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current slide and activate corresponding dot
    if (slides[index - 1]) {
        slides[index - 1].classList.add('active');
        dots[index - 1].classList.add('active');
    }
}

function startHistoryAutoSlide() {
    historySlideInterval = setInterval(function() {
        changeHistorySlide(1);
    }, 6000); // 6 segundos para el carrusel de historia
}

function resetHistoryAutoSlide() {
    clearInterval(historySlideInterval);
    startHistoryAutoSlide();
}

function setupHistoryCarouselEvents() {
    const carousel = document.querySelector('#historia');
    if (!carousel) return;

    // Pause auto-slide on hover
    carousel.addEventListener('mouseenter', function() {
        clearInterval(historySlideInterval);
    });

    carousel.addEventListener('mouseleave', function() {
        startHistoryAutoSlide();
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleHistorySwipe();
    });

    function handleHistorySwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                changeHistorySlide(1);
            } else {
                changeHistorySlide(-1);
            }
        }
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Document Ready - Todas las inicializaciones aquí
document.addEventListener('DOMContentLoaded', function() {
    // Observe all sections para animaciones
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });
    
    // Inicializar carrusel de historia si existe
    const historyCarousel = document.querySelector('#historia');
    if (historyCarousel) {
        initHistoryCarousel();
        setupHistoryCarouselEvents();
    }
    
    // Event listener para cerrar modal al hacer click fuera
    const historyModal = document.getElementById('historyModal');
    if (historyModal) {
        historyModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeHistoryModal();
            }
        });
    }
    
    // Funcionalidad del menú hamburguesa
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Cerrar menú al hacer click en un enlace
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Hacer funciones globales para el modal de historia
    window.openHistoryModal = function(type) {
        const modal = document.getElementById('historyModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalIcon = document.getElementById('modalIcon');
        const modalBody = document.getElementById('modalBody');
        
        const content = {
            fundacion: {
                icon: '⛪',
                title: '1537 - Fundación de Popayán',
                body: `
                    <div class="info-section">
                        <h3>Los Primeros Días</h3>
                        <p><span class="highlight">15 de agosto de 1537</span> - Día de La Asunción: Primera vez que se dio culto a Dios en la recién fundada ciudad de Popayán, según documenta el presbítero e historiador Manuel A. Bueno.</p>
                        
                        <h3>Contexto Histórico</h3>
                        <ul class="info-list">
                            <li>• Popayán fue fundada por Sebastián de Belalcázar</li>
                            <li>• Ubicada estratégicamente en el Valle de Pubenza</li>
                            <li>• Centro de poder colonial en el sur del Virreinato</li>
                            <li>• Los primeros templos se construyeron de inmediato</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h3>Importancia Religiosa</h3>
                        <p>Desde sus primeros meses, Popayán se estableció como un centro de profunda religiosidad, sentando las bases para lo que siglos después se convertiría en una de las tradiciones más importantes de América Latina.</p>
                        
                        <h3>Fuentes Históricas</h3>
                        <p>El testimonio del presbítero Manuel A. Bueno es una de las referencias más importantes sobre los orígenes de la vida religiosa en Popayán, documentando el fervor católico desde la fundación misma de la ciudad.</p>
                    </div>
                `
            },
            procesiones: {
                icon: '🚶‍♂️',
                title: '1556 - Inicio de las Procesiones',
                body: `
                    <div class="info-section">
                        <h3>El Comienzo de una Tradición</h3>
                        <p><span class="highlight">Año 1556</span> - Las Procesiones de Semana Santa de Popayán inician como muestra religiosa en conmemoración de la pasión, muerte y resurrección de Jesús.</p>
                        
                        <h3>Testimonio Histórico</h3>
                        <p>Juan de Castellanos en sus <em>"Elegías de varones ilustres de Indias"</em> narró cómo en el año 1556 se realizaron las primeras celebraciones de Semana Santa en la capital caucana.</p>
                        
                        <h3>Características Originales</h3>
                        <ul class="info-list">
                            <li>• Influencia de tradiciones españolas</li>
                            <li>• Primeras imágenes talladas en madera</li>
                            <li>• Participación de la comunidad colonial</li>
                            <li>• Procesiones nocturnas con antorchas</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h3>Legado Duradero</h3>
                        <p>Estas procesiones iniciadas en 1556 han continuado durante más de 450 años, convirtiéndose en una de las tradiciones religiosas más antiguas y continuas de América.</p>
                        
                        <h3>Documentación</h3>
                        <p>Los relatos de Juan de Castellanos constituyen uno de los primeros registros escritos de estas celebraciones, proporcionando valiosa información sobre los orígenes de esta tradición centenaria.</p>
                    </div>
                `
            },
            bolivar: {
                icon: '⚔',
                title: '1826 - Procesión en Honor a Bolívar',
                body: `
                    <div class="info-section">
                        <h3>El Libertador en Popayán</h3>
                        <p><span class="highlight">Última semana de octubre de 1826</span> - Simón Bolívar regresa triunfante después de la batalla de Ayacucho, una de las victorias decisivas para la independencia de América del Sur.</p>
                        
                        <h3>Una Procesión Especial</h3>
                        <p>Los payaneses organizaron en honor al Libertador una procesión semejante a las de Semana Santa, adaptando sus tradiciones religiosas para honrar al héroe de la independencia.</p>
                        
                        <h3>Significado Histórico</h3>
                        <ul class="info-list">
                            <li>• Momento clave de la independencia americana</li>
                            <li>• Unión de lo religioso y lo patriótico</li>
                            <li>• Reconocimiento al Libertador</li>
                            <li>• Adaptación de tradiciones ancestrales</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h3>La Batalla de Ayacucho</h3>
                        <p>Esta batalla, librada el 9 de diciembre de 1824, selló definitivamente la independencia del Perú y por ende de América del Sur del dominio español.</p>
                        
                        <h3>Simbolismo Payanés</h3>
                        <p>Que Popayán utilizara el formato de sus sagradas procesiones para honrar a Bolívar demuestra la profundidad del respeto y gratitud que sentía la ciudad hacia el Libertador, fusionando fe y patriotismo.</p>
                    </div>
                `
            },
            supremos: {
                icon: '⚔',
                title: '1840 - Los Supremos Participan',
                body: `
                    <div class="info-section">
                        <h3>Un Momento Histórico</h3>
                        <p><span class="highlight">14 de abril de 1840</span> - José María Obando y Juan Gregorio Sarria, conocidos como los "supremos", dejan sus armas durante la Semana Santa para participar en la procesión del martes santo.</p>
                        
                        <h3>La Guerra de los Supremos</h3>
                        <p>Este conflicto civil enfrentó al gobierno central con caudillos regionales que se autoproclamaron "supremos" en diferentes regiones del país, bajo la presidencia de José Ignacio de Márquez.</p>
                        
                        <h3>El Gesto de Paz</h3>
                        <ul class="info-list">
                            <li>• Participación en la procesión del martes santo</li>
                            <li>• Vestidos de cargueros al estilo sevillano</li>
                            <li>• Deposición temporal de las armas</li>
                            <li>• Respeto por la tradición religiosa</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h3>Contexto Político</h3>
                        <p>La participación de los "supremos" en las procesiones demostraba cómo las tradiciones religiosas de Popayán trascendían las divisiones políticas y militares de la época.</p>
                        
                        <h3>Simbolismo</h3>
                        <p>Este evento ilustra el poder unificador de las procesiones payanesas, capaces de detener temporalmente los conflictos armados en honor a la fe y las tradiciones ancestrales.</p>
                    </div>
                `
            },
            vergara: {
                icon: '📝',
                title: '1859 - Descripción de Vergara y Vergara',
                body: `
                    <div class="info-section">
                        <h3>El Cronista José María Vergara y Vergara</h3>
                        <p><span class="highlight">Año 1859</span> - El destacado cronista describió la Semana mayor de Popayán como "un acto solemne e importante para el pueblo payanés que cada año lo recibía con fervor y fe".</p>
                        
                        <h3>Su Descripción Histórica</h3>
                        <p>En sus escritos, Vergara y Vergara documentó las celebraciones que ya llevaban más de 300 años de tradición, destacando la devoción y participación masiva del pueblo payanés.</p>
                        
                        <h3>Importancia del Testimonio</h3>
                        <ul class="info-list">
                            <li>• Registro detallado del siglo XIX</li>
                            <li>• Descripción del fervor popular</li>
                            <li>• Documentación de tradiciones centenarias</li>
                            <li>• Testimonio de continuidad histórica</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h3>El Contexto de 1859</h3>
                        <p>Para esta época, las procesiones ya eran una tradición consolidada de más de tres siglos, con participación masiva de toda la comunidad payanesa y reconocimiento a nivel nacional.</p>
                        
                        <h3>Legado Literario</h3>
                        <p>Los escritos de Vergara y Vergara constituyen una valiosa fuente histórica que documenta la importancia social y religiosa de las procesiones en el siglo XIX, sirviendo como referencia para historiadores posteriores.</p>
                    </div>
                `
            },
            terremoto: {
                icon: '🌍',
                title: '1983 - El Terremoto',
                body: `
                    <div class="info-section">
                        <h3>El Día que Todo Cambió</h3>
                        <p><span class="highlight">31 de marzo de 1983 - Jueves Santo</span> - Un devastador terremoto de magnitud 5.5 sacudió Popayán a las 8:15 AM, destruyendo gran parte del centro histórico y cambiando para siempre la vida de la ciudad.</p>
                        
                        <h3>Las Consecuencias Devastadoras</h3>
                        <ul class="info-list">
                            <li>• Más de 300 personas perdieron la vida</li>
                            <li>• Destrucción del 80% del centro histórico colonial</li>
                            <li>• Graves daños en templos centenarios</li>
                            <li>• Primera suspensión de procesiones en 450+ años</li>
                            <li>• Miles de familias quedaron sin hogar</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h3>La Reconstrucción</h3>
                        <p>Tras el terremoto, Popayán inició un monumental proceso de reconstrucción que duró años, restaurando no solo edificios sino también el espíritu de una comunidad devastada.</p>
                        
                        <h3>Resiliencia Payanesa</h3>
                        <p>La tragedia demostró la fortaleza del pueblo payanés. En 1984, las procesiones se reanudaron con mayor fervor que nunca, como símbolo de fe, resistencia y renacimiento ante la adversidad.</p>
                        
                        <h3>Un Hito Histórico</h3>
                        <p>En más de cuatro siglos y medio de historia, solo en dos ocasiones se han suspendido las procesiones: 1983 por el terremoto y 2020-2021 por la pandemia.</p>
                    </div>
                `
            },
            unesco: {
                icon: '🏆',
                title: '2009 - Declaración UNESCO',
                body: `
                    <div class="info-section">
                        <h3>Reconocimiento Mundial</h3>
                        <p><span class="highlight">2009</span> - Las procesiones de Semana Santa de Popayán fueron declaradas Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO, reconociendo 453 años de tradición ininterrumpida.</p>
                        
                        <h3>Importancia del Reconocimiento</h3>
                        <ul class="info-list">
                            <li>• Valor universal excepcional reconocido mundialmente</li>
                            <li>• Preservación de tradiciones ancestrales</li>
                            <li>• Importancia comunitaria y cultural</li>
                            <li>• Transmisión generacional continua</li>
                            <li>• Técnicas artesanales únicas</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h3>Criterios de Selección UNESCO</h3>
                        <p>La UNESCO destacó la continuidad histórica, la participación comunitaria masiva, la maestría artesanal en la elaboración de pasos e imágenes, y el valor como expresión cultural viva que mantiene la cohesión social.</p>
                        
                        <h3>Responsabilidad Mundial</h3>
                        <p>Este reconocimiento convierte a las procesiones payanesas en un tesoro que debe ser protegido no solo por Colombia, sino por toda la humanidad para las futuras generaciones.</p>
                        
                        <h3>De la Colonia al Siglo XXI</h3>
                        <p>De una tradición iniciada en 1556 durante la época colonial, las procesiones han evolucionado hasta convertirse en un patrimonio reconocido mundialmente en el siglo XXI.</p>
                    </div>
                `
            },
            pandemia: {
                icon: '🦠',
                title: '2020-2021 - Pandemia COVID-19',
                body: `
                    <div class="info-section">
                        <h3>Segunda Suspensión Histórica</h3>
                        <p><span class="highlight">2020 y 2021</span> - Se suspenden nuevamente los desfiles procesionales debido a la pandemia mundial por COVID-19, siendo la segunda vez en la historia después del terremoto de 1983.</p>
                        
                        <h3>Contexto Mundial Excepcional</h3>
                        <p>La pandemia de COVID-19 obligó a suspender celebraciones religiosas en todo el mundo, afectando tradiciones centenarias como las procesiones payanesas que habían resistido guerras, conflictos y catástrofes naturales.</p>
                        
                        <h3>Medidas Adoptadas</h3>
                        <ul class="info-list">
                            <li>• Suspensión total de procesiones presenciales</li>
                            <li>• Celebraciones virtuales y transmisiones en vivo</li>
                            <li>• Protección de la salud pública</li>
                            <li>• Preservación de vidas humanas como prioridad</li>
                            <li>• Adaptación digital de las tradiciones</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h3>Resiliencia Digital</h3>
                        <p>Como en 1983, la comunidad payanés demostró su capacidad de adaptación, manteniendo viva la tradición a través de medios digitales, transmisiones virtuales y ceremonias íntimas.</p>
                        
                        <h3>El Anhelado Regreso</h3>
                        <p>Las procesiones regresaron en 2022 con renovado fervor y emoción, demostrando una vez más la fuerza inquebrantable de esta tradición que ha perdurado por casi cinco siglos.</p>
                        
                        <h3>Lecciones de Resistencia</h3>
                        <p>Tanto el terremoto de 1983 como la pandemia de 2020-2021 han demostrado que las procesiones de Popayán trascienden las circunstancias, manteniéndose vivas en el corazón de su pueblo.</p>
                    </div>
                `
            }
        };
        
        const selectedContent = content[type] || content.fundacion;
        modalIcon.textContent = selectedContent.icon;
        modalTitle.textContent = selectedContent.title;
        modalBody.innerHTML = selectedContent.body;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeHistoryModal = function() {
        const modal = document.getElementById('historyModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };
});