// Main application entry point
// Import utilities (these will be available globally via window object from individual files)

// Safe storage utilities
function safeStorage(key, fallback) {
    try { return localStorage.getItem(key) || fallback; }
    catch (_) { return fallback; }
}
function safeStorageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) { /* silencioso */ }
}

// Initialize global state
// Initialize language and theme
initLanguage();
initTheme();

// Initialize modules
function initModules() {
    // Initialize theme
    if (window.initTheme) {
        currentTheme = window.initTheme();
    }
    
    // Initialize typed effect
    if (window.initTypedEffect) {
        window.initTypedEffect();
    }
    
    // Initialize theme icon
    if (window.updateThemeIcon) {
        window.updateThemeIcon();
    }
    
    // Initialize language toggle button
    updateLanguageToggleButton();
}

// Language management
function updateLanguage() {
    document.querySelectorAll('[data-es][data-en]').forEach(element => {
        // Skip the typing effect element as we handle it separately
        if (element.id === 'typed-greeting') {
            return;
        }
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
    
    // Re-initialize typing effect when language changes
    if (window.initTypedEffect) {
        window.initTypedEffect();
    }
}

function updateLanguageToggleButton() {
    const languageToggle = document.getElementById('lang-toggle');
    if (languageToggle) {
        languageToggle.innerHTML = currentLanguage === 'es'
            ? '<span>ES</span> / <span style="opacity:0.5">EN</span>'
            : '<span style="opacity:0.5">ES</span> / <span>EN</span>';
    }
}

// Theme management
function updateTheme() {
    if (window.updateThemeIcon) {
        window.updateThemeIcon();
    }
}

// Notification function (wrapper)
function showNotification(message, type = 'info') {
    if (window.showNotification) {
        window.showNotification(message, type);
    }
}

// Component loading
function loadComponent(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
            return response.text();
        });
}

function initPage() {
    // Cache frequently used elements
    const languageToggle = document.getElementById('lang-toggle');
    const themeToggle = document.getElementById('theme-toggle');

    // ==================== SMOOTH SCROLLING PARA ANCHORS ====================
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, targetId);
            }
        }
    });

    // ==================== CAMBIO DE IDIOMA ====================
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
            document.documentElement.setAttribute('data-lang', currentLanguage);
            safeStorageSet('language', currentLanguage);
            updateLanguage();
            updateLanguageToggleButton();
        });
    }

    // ==================== CAMBIO DE TEMA ====================
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', currentTheme);
            safeStorageSet('theme', currentTheme);
            updateTheme();
        });
    }

    // Execute initial updates
    updateLanguage();
    updateLanguageToggleButton();
    updateTheme();
    
    // Initialize typed effect
    if (window.initTypedEffect) {
        window.initTypedEffect();
    }

    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 200, density: { enable: true, value_area: 800 } },
                color: { value: '#ecec0a' },
                shape: { type: 'circle' },
                opacity: { value: 0.3, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#fcfc07', opacity: 0.7, width: 1 },
                move: { enable: true, speed: 1, direction: 'none', random: false, straight: false }
            }
        });
    }

    // ==================== ANIMACIÓN DE ESTADÍSTICAS ====================
    document.addEventListener('DOMContentLoaded', () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (!statNumbers.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    const rawValue = entry.target.getAttribute('data-value') || '0';
                    const target = parseInt(rawValue) || 0;
                    const suffix = rawValue.includes('+') ? '+' : '';
                    
                    entry.target.classList.add('animated');
                    
                    // Animate the counter
                    if (window.animateCounter) {
                        window.animateCounter(entry.target, target, suffix);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statNumbers.forEach(stat => {
            const rect = stat.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                stat.dispatchEvent(new Event('forceAnimate'));
            }
            observer.observe(stat);
        });
    });

    // ==================== EMAILJS + FORMULARIO ====================
    if (typeof emailjs !== 'undefined') {
        emailjs.init('imMlDc-9gQwzPoKo0');
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
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

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = currentLanguage === 'es' ? 'Enviando...' : 'Sending...';

            const templateParams = {
                from_name: name,
                reply_to: email,
                subject: subject,
                message: message,
                to_name: 'Didier Najas',
                to_email: 'didiernajas2006@gmail.com'
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

    // ==================== ANIMACIONES DE SCROLL ====================
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
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    const updateActiveNavLink = () => {
        let current = '';
        const scrollPosition = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${current}`;
            link.classList.toggle('active', isActive);
        });
    };

    // Throttle for performance
    function throttle(fn, delay) {
        let lastExec = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastExec >= delay) {
                fn.apply(this, args);
                lastExec = now;
            }
        };
    }

    const throttledUpdateNav = throttle(updateActiveNavLink, 100);
    window.addEventListener('scroll', throttledUpdateNav);
    updateActiveNavLink(); // Initial call

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
    window.addEventListener('load', () => {
        document.querySelectorAll('.reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });

        document.querySelectorAll('.stat-number:not(.animated)').forEach(stat => {
            const rect = stat.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                const rawValue = stat.getAttribute('data-value') || '0';
                const target = parseInt(rawValue) || 0;
                const suffix = rawValue.includes('+') ? '+' : '';
                stat.classList.add('animated');
                if (window.animateCounter) {
                    window.animateCounter(stat, target, suffix);
                }
            }
        });
    });

    // Fallback de seguridad
    setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            el.classList.add('visible');
        });
    }, 2000);
}

// Utility function for DOM ready
function domReady() {
    return new Promise((resolve) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
}

// Main initialization
(function () {
    domReady().then(() => {
        let baseUrl = window.baseUrl || '';
        if (!baseUrl) {
            const script = document.currentScript;
            if (script && script.src) {
                try {
                    const url = new URL(script.src, window.location.href);
                    baseUrl = url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1);
                } catch (e) {
                    baseUrl = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                }
            } else {
                baseUrl = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
            }
        }

        const components = [
            { id: 'header-component', url: baseUrl + 'components/header.html' },
            { id: 'inicio', url: baseUrl + 'components/hero.html' },
            { id: 'stats-component', url: baseUrl + 'components/stats.html' },
            { id: 'sobre-mi', url: baseUrl + 'components/about.html' },
            { id: 'experiencia', url: baseUrl + 'components/experience.html' },
            { id: 'habilidades', url: baseUrl + 'components/skills.html' },
            { id: 'proyectos', url: baseUrl + 'components/projects.html' },
            { id: 'contacto', url: baseUrl + 'components/contact.html' },
            { id: 'footer-component',  url: baseUrl + 'components/footer.html' },
            { id: 'modals-component',  url: baseUrl + 'components/modals.html' }
        ];

        const promises = components.map(({id, url}) =>
            loadComponent(url).then(html => {
                const el = document.getElementById(id);
                if (el) {
                    el.innerHTML = html;
                } else {
                    console.error(`Element with id ${id} not found`);
                }
            })
        );

        Promise.all(promises)
            .then(() => {
                initModules();
                initPage();
            })
            .catch(error => {
                console.error('Error loading components:', error);
                showNotification(
                    currentLanguage === 'es' 
                        ? 'Error al cargar componentes. Recarga la página.' 
                        : 'Error loading components. Please reload the page.',
                    'error'
                );
            });
    });
})();