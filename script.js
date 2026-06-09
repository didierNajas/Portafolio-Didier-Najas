// ==================== CONFIGURACIÓN INICIAL ====================
let currentLanguage = localStorage.getItem('language') || 'es';
let currentTheme = localStorage.getItem('theme') || 'dark';

// Aplicar tema y idioma al cargar
document.body.setAttribute('data-theme', currentTheme);
document.documentElement.setAttribute('data-lang', currentLanguage);

// ==================== CAMBIO DE IDIOMA ====================
const languageToggle = document.getElementById('lang-toggle');
if (languageToggle) {
    languageToggle.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
        document.documentElement.setAttribute('data-lang', currentLanguage);
        localStorage.setItem('language', currentLanguage);
        updateLanguage();
        updateToggleButton();
    });
}

function updateLanguage() {
    document.querySelectorAll('[data-es][data-en]').forEach(element => {
        const text = currentLanguage === 'es' ? element.getAttribute('data-es') : element.getAttribute('data-en');
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
            element.textContent = text;
        } else if (element.childNodes.length === 0) {
            element.textContent = text;
        } else {
            // Para elementos con contenido mixto, actualizar solo el nodo de texto principal
            const textNode = Array.from(element.childNodes).find(node => node.nodeType === 3);
            if (textNode) {
                textNode.textContent = text;
            }
        }
    });
}

function updateToggleButton() {
    if (languageToggle) {
        if (currentLanguage === 'es') {
            languageToggle.innerHTML = '<span>ES</span> / <span style="opacity: 0.5;">EN</span>';
        } else {
            languageToggle.innerHTML = '<span style="opacity: 0.5;">ES</span> / <span>EN</span>';
        }
    }
}

// ==================== CAMBIO DE TEMA ====================
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon();
    });
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (currentTheme === 'dark') {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Ejecutar en carga
updateToggleButton();
updateThemeIcon();

// ==================== ANIMACIÓN DE ESTADÍSTICAS ====================
const animateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    const options = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const target = parseInt(entry.target.getAttribute('data-value'));
                let current = 0;
                const increment = target / 60;

                const counter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target;
                        entry.target.classList.add('animated');
                        clearInterval(counter);
                    } else {
                        entry.target.textContent = Math.floor(current);
                    }
                }, 30);

                observer.unobserve(entry.target);
            }
        });
    }, options);

    statNumbers.forEach(stat => observer.observe(stat));
};

document.addEventListener('DOMContentLoaded', animateStats);

// ==================== VALIDACIÓN DEL FORMULARIO ====================
// Inicializar EmailJS con tu Public Key
emailjs.init('imMlDc-9gQwzPoKo0');

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validación básica
        if (!name || !email || !subject || !message) {
            showNotification(currentLanguage === 'es' ? 'Por favor completa todos los campos' : 'Please fill all fields', 'error');
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification(currentLanguage === 'es' ? 'Email inválido' : 'Invalid email', 'error');
            return;
        }

        // Deshabilitar botón mientras envía
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = currentLanguage === 'es' ? 'Enviando...' : 'Sending...';

        // Parámetros del template EmailJS
        const templateParams = {
            from_name: name,
            reply_to: email,
            subject: subject,
            message: message,
            to_name: 'Didier Najas',
            to_email: 'didiernajas2006@gmail.com'
        };

        // Enviar con EmailJS
        // Reemplaza 'TU_SERVICE_ID' y 'TU_TEMPLATE_ID' con los tuyos
        emailjs.send('service_k8a2u6a', 'template_yha4upm', templateParams)
            .then(() => {
                showNotification(
                    currentLanguage === 'es'
                        ? '¡Mensaje enviado exitosamente! Pronto te contactaré.'
                        : 'Message sent successfully! I will contact you soon.',
                    'success'
                );
                contactForm.reset();
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                showNotification(
                    currentLanguage === 'es'
                        ? 'Error al enviar el mensaje. Intenta de nuevo.'
                        : 'Error sending message. Please try again.',
                    'error'
                );
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
    });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ff1744' : '#a855f7'};
        color: white;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== INTERSECTION OBSERVER PARA ANIMACIONES ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            elementObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Animar elementos al scroll
document.querySelectorAll('.project-card, .skill-category, .highlight-box, .contact-link, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    elementObserver.observe(el);
});

// ==================== NAVBAR ACTIVA SEGÚN SCROLL ====================
window.addEventListener('scroll', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ==================== EFECTO PARALLAX EN HERO ====================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-section');
    const scrollY = window.pageYOffset;
    if (hero) {
        hero.style.backgroundPosition = `0 ${scrollY * 0.5}px`;
    }
});

// ==================== CERRAR NAVBAR AL HACER CLICK EN LINK ====================
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbar = document.querySelector('.navbar-collapse');
        if (navbar.classList.contains('show')) {
            const closeButton = document.querySelector('.navbar-toggler');
            closeButton.click();
        }
    });
});

// ==================== EFECTO HOVER EN PROYECTO CARDS ====================
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// ==================== SMOOTH SCROLL PARA ENLACES ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== ANIMACIONES CSS ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== TOOLTIP EN SKILLS ====================
document.querySelectorAll('.skill-badge').forEach(badge => {
    badge.addEventListener('mouseenter', function() {
        this.title = this.textContent;
    });
});

// ==================== PREVENIR CLICS MÚLTIPLES EN BOTONES ====================
document.querySelectorAll('.btn-gradient, .btn-outline-light, .btn-demo').forEach(btn => {
    btn.addEventListener('click', function(e) {
        this.style.pointerEvents = 'none';
        setTimeout(() => {
            this.style.pointerEvents = 'auto';
        }, 500);
    });
});

// ==================== MONITOREAR VIEWPORT PARA EFECTOS ====================
const revealOnScroll = () => {
    document.querySelectorAll('.section-header').forEach(header => {
        const rect = header.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            header.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

console.log('✓ Portafolio cargado correctamente');
console.log(`✓ Idioma: ${currentLanguage === 'es' ? 'Español' : 'English'}`);
console.log(`✓ Tema: ${currentTheme === 'dark' ? 'Oscuro' : 'Claro'}`);
console.log('✓ Todos los scripts funcionando sin errores');
