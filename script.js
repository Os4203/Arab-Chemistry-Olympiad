/**
 * Arab Chemistry Olympiad Website JavaScript
 * Enhanced mobile navigation with robust menu functionality
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeContactForm();
});

/**
 * Enhanced navigation functionality with robust mobile menu
 */
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    
    if (!hamburger || !navMenu) {
        console.log('Navigation elements not found');
        return;
    }

    // Mobile menu toggle with enhanced functionality
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = hamburger.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        body.classList.add('menu-open');
        
        // Create and add overlay if it doesn't exist
        let overlay = document.querySelector('.menu-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'menu-overlay';
            overlay.addEventListener('click', closeMenu);
            document.body.appendChild(overlay);
        }
        
        // Close any open dropdowns
        closeAllDropdowns();
        
        // Add escape key listener
        document.addEventListener('keydown', handleEscapeKey);
        
        // Prevent body scroll
        body.style.overflow = 'hidden';
        
        // Focus trap for accessibility
        navMenu.focus();
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
        
        // Close all dropdowns
        closeAllDropdowns();
        
        // Remove escape key listener
        document.removeEventListener('keydown', handleEscapeKey);
        
        // Restore body scroll
        body.style.overflow = '';
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }
    });

    // Enhanced dropdown functionality
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        const dropdown = toggle.parentElement;
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        
        if (!dropdownContent) return;

        // Handle dropdown toggle clicks
        toggle.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for dropdown toggles (href="#")
            if (href === '#' || href === '' || href === null) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            if (window.innerWidth <= 768) {
                toggleDropdown(dropdown, dropdownContent);
            }
        });

        // Handle dropdown link clicks
        const dropdownLinks = dropdownContent.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    // Close menu after clicking a dropdown link
                    setTimeout(() => {
                        closeMenu();
                    }, 100);
                }
            });
        });
    });

    function toggleDropdown(dropdown, dropdownContent) {
        const isOpen = dropdown.classList.contains('dropdown-open');
        
        // Close all other dropdowns first
        closeAllDropdowns();
        
        if (!isOpen) {
            dropdown.classList.add('dropdown-open');
            dropdownContent.style.display = 'block';
            dropdownContent.style.maxHeight = dropdownContent.scrollHeight + 'px';
        }
    }

    function closeAllDropdowns() {
        const openDropdowns = document.querySelectorAll('.dropdown.dropdown-open');
        openDropdowns.forEach(dropdown => {
            dropdown.classList.remove('dropdown-open');
            const content = dropdown.querySelector('.dropdown-content');
            if (content) {
                content.style.display = 'none';
                content.style.maxHeight = '0';
            }
        });
    }

    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth > 768) {
            closeMenu();
            closeAllDropdowns();
        }
    }, 250));

    // Touch event handling for better mobile interaction
    let touchStartY = 0;
    
    navMenu.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    navMenu.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const scrollTop = navMenu.scrollTop;
        
        // Prevent body scroll when menu is at the top or bottom
        if ((scrollTop === 0 && touchY > touchStartY) || 
            (scrollTop >= navMenu.scrollHeight - navMenu.clientHeight && touchY < touchStartY)) {
            e.preventDefault();
        }
    }, { passive: false });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only prevent default and scroll if target exists
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Initialize animations and scroll effects
 */
function initializeAnimations() {
    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) {
        console.log('IntersectionObserver not supported');
        return;
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('section');
    if (sections.length > 0) {
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Animate cards
    const cards = document.querySelectorAll('.team-card, .stat-item, .schedule-item, .content-card');
    if (cards.length > 0) {
        cards.forEach(card => {
            observer.observe(card);
        });
    }

    // Counter animation for statistics
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        statNumbers.forEach(stat => {
            observer.observe(stat);
            stat.addEventListener('animationstart', function() {
                animateCounter(this);
            });
        });
    }
}

/**
 * Animate counter numbers
 */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target') || element.textContent);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (target - start) * easeOutQuart(progress));
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(updateCounter);
}

/**
 * Easing function for smooth animations
 */
function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

/**
 * Initialize contact form functionality
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Validate form
            if (validateForm(formObject)) {
                // Show success message
                showMessage('تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.', 'success');
                
                // Reset form
                this.reset();
            } else {
                showMessage('يرجى ملء جميع الحقول المطلوبة.', 'error');
            }
        });
    }
}

/**
 * Validate contact form
 */
function validateForm(data) {
    const required = ['name', 'email', 'subject', 'message'];
    
    return required.every(field => {
        const value = data[field];
        return value && value.trim() !== '';
    });
}

/**
 * Show message to user
 */
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    // Insert message
    const form = document.getElementById('contactForm');
    if (form) {
        form.parentNode.insertBefore(messageDiv, form);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

/**
 * Utility function to debounce events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handle window resize events
 */
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }

        // Hide dropdown contents on desktop
        const dropdownContents = document.querySelectorAll('.dropdown-content');
        dropdownContents.forEach(content => {
            content.style.display = '';
        });
    }
}, 250));

/**
 * Handle scroll events for header
 */
window.addEventListener('scroll', debounce(function() {
    const header = document.querySelector('.header');
    
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}, 10));

/**
 * Initialize page-specific functionality
 */
function initializePageSpecific() {
    // Syllabus page animations
    const syllabusContainer = document.querySelector('.syllabus-container');
    if (syllabusContainer && window.IntersectionObserver) {
        const sectionCards = document.querySelectorAll('.section-card');
        
        if (sectionCards.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            sectionCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
        }
    }
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', initializePageSpecific);

// Error handling for global errors
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
    
    // Prevent error from breaking the page
    return true;
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    
    // Prevent unhandled rejection from showing in console
    e.preventDefault();
});

// Service worker registration (if available)
// Commented out until service worker file is created
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
*/ 