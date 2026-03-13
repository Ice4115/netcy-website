/* ========================================
   PORTFOLIO BTS SIO - JUNG JEAN-MARIE
   JavaScript - Animations & Interactions
   ======================================== */

// ========================================
// INITIALISATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTypewriter();
    initTimeline();
    initModals();
    initCVToggle();
    initScrollAnimations();
    initSmoothScroll();
    initContactForm();
});

// ========================================
// NAVIGATION MOBILE
// ========================================
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.getElementById('siteNav');
    
    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            siteNav.classList.toggle('active');
        });
        
        // Fermer le menu au clic sur un lien
        const navLinks = siteNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                siteNav.classList.remove('active');
            });
        });
    }
}

// ========================================
// EFFET TYPEWRITER POUR LE NOM
// ========================================
function initTypewriter() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        const speed = parseInt(element.dataset.speed) || 100;
        const backSpeed = parseInt(element.dataset.backSpeed) || 50;
        const holdStart = parseInt(element.dataset.holdStart) || 500;
        const holdEnd = parseInt(element.dataset.holdEnd) || 2000;
        const loop = element.dataset.loop === 'true';
        const pingpong = element.dataset.pingpong === 'true';
        
        element.textContent = '';
        
        let currentIndex = 0;
        let isDeleting = false;
        let isPaused = false;
        
        function type() {
            if (isPaused) return;
            
            if (!isDeleting && currentIndex < text.length) {
                // Écriture
                element.textContent = text.substring(0, currentIndex + 1);
                currentIndex++;
                setTimeout(type, speed);
            } else if (!isDeleting && currentIndex === text.length) {
                // Pause à la fin
                if (pingpong || loop) {
                    isPaused = true;
                    setTimeout(() => {
                        isPaused = false;
                        isDeleting = true;
                        type();
                    }, holdEnd);
                }
            } else if (isDeleting && currentIndex > 0) {
                // Effacement
                currentIndex--;
                element.textContent = text.substring(0, currentIndex);
                setTimeout(type, backSpeed);
            } else if (isDeleting && currentIndex === 0) {
                // Pause au début avant de recommencer
                isDeleting = false;
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    type();
                }, holdStart);
            }
        }
        
        // Démarrage avec un petit délai
        setTimeout(() => type(), 500);
    });
}

// ========================================
// TIMELINE HORIZONTALE - DRAG & AUTO-SCROLL
// ========================================
function initTimeline() {
    const viewport = document.getElementById('timelineViewport');
    const track = document.getElementById('timelineTrack');
    
    if (!viewport || !track) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollInterval;
    let isAutoScrolling = true;
    
    // Auto-scroll
    function startAutoScroll() {
        if (!isAutoScrolling) return;
        
        autoScrollInterval = setInterval(() => {
            if (isDown) return; // Ne pas auto-scroll pendant le drag
            
            const maxScroll = track.scrollWidth - viewport.clientWidth;
            const currentScroll = viewport.scrollLeft;
            
            if (currentScroll >= maxScroll) {
                // Retour au début en douceur
                viewport.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                // Scroll progressif
                viewport.scrollBy({
                    left: 1,
                    behavior: 'auto'
                });
            }
        }, 30); // Vitesse de défilement
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    // Drag to scroll
    viewport.addEventListener('mousedown', (e) => {
        isDown = true;
        viewport.style.cursor = 'grabbing';
        startX = e.pageX - viewport.offsetLeft;
        scrollLeft = viewport.scrollLeft;
        stopAutoScroll();
        isAutoScrolling = false;
    });
    
    viewport.addEventListener('mouseleave', () => {
        isDown = false;
        viewport.style.cursor = 'grab';
    });
    
    viewport.addEventListener('mouseup', () => {
        isDown = false;
        viewport.style.cursor = 'grab';
        // Reprendre l'auto-scroll après 3 secondes d'inactivité
        setTimeout(() => {
            isAutoScrolling = true;
            startAutoScroll();
        }, 3000);
    });
    
    viewport.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - viewport.offsetLeft;
        const walk = (x - startX) * 2; // Vitesse du drag
        viewport.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events pour mobile
    let touchStartX = 0;
    let touchScrollLeft = 0;
    
    viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX - viewport.offsetLeft;
        touchScrollLeft = viewport.scrollLeft;
        stopAutoScroll();
        isAutoScrolling = false;
    });
    
    viewport.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - viewport.offsetLeft;
        const walk = (x - touchStartX) * 2;
        viewport.scrollLeft = touchScrollLeft - walk;
    });
    
    viewport.addEventListener('touchend', () => {
        setTimeout(() => {
            isAutoScrolling = true;
            startAutoScroll();
        }, 3000);
    });
    
    // Démarrer l'auto-scroll
    startAutoScroll();
    
    // Pause au survol
    viewport.addEventListener('mouseenter', () => {
        if (!isDown) {
            stopAutoScroll();
        }
    });
    
    viewport.addEventListener('mouseleave', () => {
        if (!isDown && isAutoScrolling) {
            startAutoScroll();
        }
    });
}

// ========================================
// MODALS - OUVERTURE/FERMETURE ANIMÉE
// ========================================
function initModals() {
    const modalTriggers = document.querySelectorAll(".card-clickable");
    const modals = document.querySelectorAll(".modal-overlay");
    const closeButtons = document.querySelectorAll(".modal-close");
    
    // Ouvrir une modale
    modalTriggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const targetId = trigger.dataset.modal;
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.classList.add("active");
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Fermer une modale avec animation fade-out
    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal-overlay");
            modal.classList.add("fade-out");
            setTimeout(() => {
                modal.classList.remove("active", "fade-out");
                document.body.style.overflow = '';
            }, 300); // durée égale à ta transition CSS (0.3s)
        });
    });
    
    // Fermer quand on clique sur le fond
    modals.forEach(modal => {
        modal.addEventListener("click", e => {
            if (e.target === modal) {
                modal.classList.add("fade-out");
                setTimeout(() => {
                    modal.classList.remove("active", "fade-out");
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    });
    
    // Fermer avec ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const active = document.querySelector('.modal-overlay.active');
            if (active) {
                active.classList.add("fade-out");
                setTimeout(() => {
                    active.classList.remove("active", "fade-out");
                    document.body.style.overflow = '';
                }, 300);
            }
        }
    });
}

// ========================================
// TOGGLE CV
// ========================================
function initCVToggle() {
    const showCvBtn = document.getElementById('showCvBtn');
    const cvEmbed = document.getElementById('cvEmbed');
    
    if (showCvBtn && cvEmbed) {
        // Animation du bouton au chargement
        showCvBtn.style.transition = 'all 0.3s ease';
        
        showCvBtn.addEventListener('click', () => {
            const isActive = cvEmbed.classList.contains('active');
            
            // Animation du bouton
            showCvBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                showCvBtn.style.transform = 'scale(1)';
            }, 150);
            
            if (isActive) {
                // Fermeture du CV
                cvEmbed.classList.remove('active');
                showCvBtn.textContent = 'Afficher le CV dans la page';
                showCvBtn.classList.remove('secondary');
            } else {
                // Ouverture du CV
                cvEmbed.classList.add('active');
                showCvBtn.textContent = 'Masquer le CV';
                showCvBtn.classList.add('secondary');
                
                // Scroll vers le CV après l'animation d'ouverture
                setTimeout(() => {
                    cvEmbed.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 500);
            }
        });
    }
}

// ========================================
// ANIMATIONS AU SCROLL
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observer toutes les sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Observer les cartes
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// ========================================
// SMOOTH SCROLL POUR LES ANCRES - AVEC MOMENTUM
// ========================================
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function momentumScroll(startPosition, endPosition, duration = 800) {
    const startTime = Date.now();
    const distance = endPosition - startPosition;
    
    function animateScroll() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing de momentum: accélération au démarrage, décélération à la fin
        const easeProgress = easeInOutCubic(progress);
        const newPosition = startPosition + distance * easeProgress;
        
        window.scrollTo(0, newPosition);
        
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }
    
    requestAnimationFrame(animateScroll);
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Ignorer les liens vides ou #
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                const currentPosition = window.pageYOffset;
                
                // Scroll avec momentum effect - durée basée sur la distance
                const distance = Math.abs(offsetPosition - currentPosition);
                const duration = Math.min(1000, 300 + distance * 0.5);
                
                momentumScroll(currentPosition, offsetPosition, duration);
            }
        });
    });
}

// ========================================
// ANIMATIONS SUPPLÉMENTAIRES AU HOVER
// ========================================

// Animation des badges
document.addEventListener('DOMContentLoaded', () => {
    const badges = document.querySelectorAll('.badge');
    
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'scale(1.1) rotate(2deg)';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// Animation des boutons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                pointer-events: none;
                animation: ripple 0.6s ease-out;
            `;
            
            const rect = button.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            
            button.style.position = 'relative';
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Animation ripple CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        from {
            width: 10px;
            height: 10px;
            opacity: 1;
        }
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ========================================
// PARALLAX LÉGER SUR LE HERO
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-card');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled * 0.002);
    }
});

// ========================================
// EASTER EGG - KONAMI CODE
// ========================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateMatrixMode();
    }
});

function activateMatrixMode() {
    // Mode Matrix activé !
    document.body.style.animation = 'matrixGlow 2s ease-in-out';
    
    // Créer un effet de pluie de code
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテト';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    let frameCount = 0;
    const maxFrames = 200;
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        
        frameCount++;
        if (frameCount < maxFrames) {
            requestAnimationFrame(drawMatrix);
        } else {
            canvas.remove();
        }
    }
    
    drawMatrix();
    
    // Message secret
    setTimeout(() => {
        alert('🎉 Mode Matrix activé ! Bienvenue dans la matrice, Neo... 🎉');
    }, 1000);
}

const matrixStyle = document.createElement('style');
matrixStyle.textContent = `
    @keyframes matrixGlow {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(120deg) brightness(1.5); }
    }
`;
document.head.appendChild(matrixStyle);

// ========================================
// PERFORMANCE - RÉDUIRE LES ANIMATIONS SI NÉCESSAIRE
// ========================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.body.dataset.allowMotion = 'false';
    
    // Désactiver certaines animations
    const style = document.createElement('style');
    style.textContent = `
        [data-allow-motion="false"] * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// FORMULAIRE DE CONTACT
// ========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Récupérer les données du formulaire
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Validation côté client
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showFormStatus('error', 'Tous les champs sont obligatoires.');
            return;
        }
        
        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showFormStatus('error', 'Veuillez entrer une adresse email valide.');
            return;
        }
        
        // Afficher le chargement
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.classList.add('loading');
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';
        
        try {
            // Envoyer les données au serveur
            const response = await fetch('send_email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Succès
                showFormStatus('success', result.message);
                form.reset();
                
                // Animation de succès
                submitBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    submitBtn.style.transform = 'scale(1)';
                }, 200);
            } else {
                // Erreur
                showFormStatus('error', result.message);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            showFormStatus('error', 'Une erreur est survenue. Veuillez réessayer ou me contacter directement à jeanmarie.jung.junior@mail.com');
        } finally {
            // Retirer le chargement
            submitBtn.classList.remove('loading');
        }
    });
}

function showFormStatus(type, message) {
    const formStatus = document.getElementById('formStatus');
    formStatus.className = `form-status ${type}`;
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    
    // Scroll vers le message
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Masquer automatiquement après 10 secondes pour les succès
    if (type === 'success') {
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 10000);
    }
}

// ========================================
// CONSOLE MESSAGE
// ========================================
console.log('%c🚀 Portfolio BTS SIO - Jung Jean-Marie', 'color: #00d9ff; font-size: 20px; font-weight: bold;');
console.log('%c💻 Développé avec passion pour la cybersécurité et l\'infrastructure', 'color: #00ff88; font-size: 14px;');
console.log('%c🔒 Thème: Cyber Security & Infrastructure', 'color: #00d9ff; font-size: 12px;');
console.log('%c✨ Essayez le Konami Code pour un easter egg !', 'color: #ffaa00; font-size: 12px; font-style: italic;');