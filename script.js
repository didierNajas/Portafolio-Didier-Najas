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
        const text = currentLanguage === 'es'
            ? element.getAttribute('data-es')
            : element.getAttribute('data-en');
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
            element.textContent = text;
        } else if (element.childNodes.length === 0) {
            element.textContent = text;
        } else {
            const textNode = Array.from(element.childNodes).find(n => n.nodeType === 3);
            if (textNode) textNode.textContent = text;
        }
    });
}

function updateToggleButton() {
    if (languageToggle) {
        languageToggle.innerHTML = currentLanguage === 'es'
            ? '<span>ES</span> / <span style="opacity:0.5">EN</span>'
            : '<span style="opacity:0.5">ES</span> / <span>EN</span>';
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
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (currentTheme === 'dark') {
        icon.classList.replace('fa-sun', 'fa-moon');
    } else {
        icon.classList.replace('fa-moon', 'fa-sun');
    }
}

// Ejecutar en carga
updateToggleButton();
updateThemeIcon();

// ==================== ANIMACIÓN DE ESTADÍSTICAS ====================
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const target = parseInt(entry.target.getAttribute('data-value')) || 0;
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
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
});

// ==================== EMAILJS + FORMULARIO ====================
// EmailJS se inicializa solo si el script está cargado
if (typeof emailjs !== 'undefined') {
    emailjs.init('imMlDc-9gQwzPoKo0');
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            showNotification(
                currentLanguage === 'es' ? 'Por favor completa todos los campos' : 'Please fill all fields',
                'error'
            );
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification(
                currentLanguage === 'es' ? 'Email inválido' : 'Invalid email',
                'error'
            );
            return;
        }

        const submitBtn  = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = currentLanguage === 'es' ? 'Enviando...' : 'Sending...';

        const templateParams = {
            from_name : name,
            reply_to  : email,
            subject   : subject,
            message   : message,
            to_name   : 'Didier Najas',
            to_email  : 'didiernajas2006@gmail.com'
        };

        if (typeof emailjs === 'undefined') {
            showNotification(
                currentLanguage === 'es'
                    ? 'Error: servicio de email no disponible.'
                    : 'Error: email service not available.',
                'error'
            );
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            return;
        }

        emailjs.send('service_k8a2u6a', 'template_yha4upm', templateParams)
            .then(() => {
                showNotification(
                    currentLanguage === 'es'
                        ? '¡Mensaje enviado! Pronto te contactaré.'
                        : 'Message sent! I will contact you soon.',
                    'success'
                );
                contactForm.reset();
            })
            .catch(err => {
                console.error('EmailJS error:', err);
                showNotification(
                    currentLanguage === 'es'
                        ? 'Error al enviar. Intenta de nuevo.'
                        : 'Error sending. Please try again.',
                    'error'
                );
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
    });
}

// ==================== NOTIFICACIONES ====================
function showNotification(message, type = 'info') {
    const colors = { success: '#10b981', error: '#ff1744', info: '#a855f7' };
    const el = document.createElement('div');
    el.textContent = message;
    el.style.cssText = `
        position:fixed; top:100px; right:20px;
        padding:1rem 1.5rem;
        background:${colors[type] || colors.info};
        color:white; border-radius:8px; font-weight:600;
        z-index:10000; box-shadow:0 10px 25px rgba(0,0,0,.2);
        animation:slideIn 0.3s ease;
    `;
    document.body.appendChild(el);
    setTimeout(() => {
        el.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => el.remove(), 300);
    }, 3000);
}

// ==================== ANIMACIONES DE SCROLL ====================
// IMPORTANTE: NO se aplica pointer-events:none a las cards para no bloquear
// los botones y links internos en GitHub Pages.
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.05, rootMargin: '0px' });

document.querySelectorAll(
    '.project-card, .skill-category, .highlight-box, .contact-link, .stat-card'
).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ==================== NAVBAR ACTIVA SEGÚN SCROLL ====================
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section[id]').forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${current}`
        );
    });
});

// ==================== CERRAR NAVBAR EN MÓVIL ====================
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbar = document.querySelector('.navbar-collapse');
        if (navbar && navbar.classList.contains('show')) {
            document.querySelector('.navbar-toggler')?.click();
        }
    });
});

// ==================== HOVER EN PROJECT CARDS ====================
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function () { this.style.zIndex = '10'; });
    card.addEventListener('mouseleave', function () { this.style.zIndex = '1'; });
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        // No interceptar links externos
        if (!href.startsWith('#')) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// ==================== ANIMACIONES CSS (inyectadas) ====================
const style = document.createElement('style');
style.textContent = `
    /* Animación de reveal sin bloquear pointer-events */
    .reveal {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .reveal.visible {
        opacity: 1;
        transform: translateY(0);
    }

    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to   { transform: translateX(0);     opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0);     opacity: 1; }
        to   { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ==================== REVEAL AL CARGAR (elementos ya visibles) ====================
// Forzar reveal de elementos que ya están en el viewport al cargar la página
window.addEventListener('load', () => {
    document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('visible');
        }
    });
});

console.log('✓ Portafolio cargado correctamente');
console.log(`✓ Idioma: ${currentLanguage === 'es' ? 'Español' : 'English'}`);
console.log(`✓ Tema: ${currentTheme === 'dark' ? 'Oscuro' : 'Claro'}`);
