const initAnimations = () => {
    // Intersection Observer for fade-in animations with delay options
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add the animate__animated class
                    entry.target.classList.add('animate__animated');
                    
                    // Add the specific animation class
                    if (entry.target.dataset.animation) {
                        entry.target.classList.add(entry.target.dataset.animation);
                    }
                    
                    // Apply delay if specified
                    if (entry.target.dataset.delay) {
                        entry.target.style.animationDelay = `${entry.target.dataset.delay}s`;
                    }
                    
                    // Apply duration if specified
                    if (entry.target.dataset.duration) {
                        entry.target.style.animationDuration = `${entry.target.dataset.duration}s`;
                    }
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all elements with data-animation
    document.querySelectorAll('[data-animation]').forEach((element) => {
        observer.observe(element);
    });
};

// Navbar scroll effect
const initNavbarEffect = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
};

// Prayer Counter Animation
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start < target) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

// Form Validation
const validateForm = (formElement) => {
    const inputs = formElement.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });

    return isValid;
};

// Parallax effect for hero sections
const initParallax = () => {
    const heroSection = document.querySelector('.hero-section, .hero-section-small');
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition < window.innerHeight) {
            heroSection.style.backgroundPositionY = `calc(50% + ${scrollPosition * 0.05}px)`;
        }
    });
};

// Initialize tooltips and popovers
const initBootstrapComponents = () => {
    // Initialize tooltips if Bootstrap 5 is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        
        // Initialize popovers
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }
};

// Add hover effect to cards
const initCardEffects = () => {
    const cards = document.querySelectorAll('.card:not(.hover-disabled)');
    cards.forEach(card => {
        card.classList.add('hover-lift');
    });
};

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initAnimations();
    
    // Initialize navbar effects
    initNavbarEffect();
    
    // Initialize parallax effects
    initParallax();
    
    // Initialize Bootstrap components
    initBootstrapComponents();
    
    // Initialize card hover effects
    initCardEffects();

    // Initialize counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        animateCounter(counter, parseInt(counter.dataset.target));
    });

    // Form submissions with validation and feedback
    document.querySelectorAll('form').forEach(form => {
        // Add input event listeners for real-time validation
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                } else if (input.required) {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                }
            });
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(form)) {
                // Show loading state
                const submitBtn = form.querySelector('[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';
                
                // Simulate form submission (replace with actual AJAX in production)
                setTimeout(() => {
                    // Add success message with animation
                    const alert = document.createElement('div');
                    alert.className = 'alert alert-success mt-3 animate__animated animate__fadeIn';
                    alert.innerHTML = '<i class="fas fa-check-circle me-2"></i> Form submitted successfully!';
                    form.appendChild(alert);
                    form.reset();
                    
                    // Reset form fields
                    form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
                    
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    
                    // Remove alert after 5 seconds
                    setTimeout(() => {
                        alert.classList.add('animate__fadeOut');
                        setTimeout(() => alert.remove(), 500);
                    }, 5000);
                }, 1500);
            }
        });
    });

    // Smooth scroll for navigation with offset for fixed navbar
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });
    
    // Add active class to nav links based on scroll position
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; // Offset for navbar
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});