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
    initializeVideoBackground();
    initializeFeaturedVideo();
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

/**
 * Initialize featured video functionality
 */
function initializeFeaturedVideo() {
    const video = document.getElementById('featuredVideo');
    const customPlayBtn = document.getElementById('customPlayBtn');
    const videoOverlay = document.querySelector('.video-overlay-info');
    
    if (!video) {
        // Featured video only exists on homepage, silently skip on other pages
        return;
    }
    
    if (!customPlayBtn) {
        // Custom play button was removed, silently skip
        return;
    }
    
    console.log('Initializing featured video functionality...');
    console.log('Video element:', video);
    console.log('Custom play button:', customPlayBtn);
    console.log('Video overlay:', videoOverlay);
    
    // Update button state
    function updateButtonState() {
        const icon = customPlayBtn.querySelector('i');
        if (!icon) {
            console.error('Play button icon not found!');
            return;
        }
        
        if (video.paused || video.ended) {
            icon.className = 'fas fa-play';
            if (videoOverlay) videoOverlay.style.opacity = '1';
            // Enable pulse animation when paused
            customPlayBtn.style.animation = 'playButtonPulse 2s ease-in-out infinite';
            console.log('Button state: PLAY (paused:', video.paused, ', ended:', video.ended, ')');
        } else {
            icon.className = 'fas fa-pause';
            if (videoOverlay) videoOverlay.style.opacity = '0';
            // Disable pulse animation when playing
            customPlayBtn.style.animation = 'none';
            console.log('Button state: PAUSE (playing)');
        }
    }
    
    // Custom play button click handler
    customPlayBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Custom play button clicked, video paused:', video.paused);
        
        if (video.paused || video.ended) {
            video.play().then(() => {
                updateButtonState();
                console.log('Video play started successfully');
            }).catch((error) => {
                console.error('Error playing video:', error);
            });
        } else {
            video.pause();
            updateButtonState();
            console.log('Video paused successfully');
        }
    });
    
    // Video event listeners
    video.addEventListener('play', function() {
        console.log('Featured video started playing');
        updateButtonState();
    });
    
    video.addEventListener('pause', function() {
        console.log('Featured video paused');
        updateButtonState();
    });
    
    video.addEventListener('ended', function() {
        console.log('Featured video ended');
        updateButtonState();
    });
    
    // Video loading events
    video.addEventListener('loadstart', function() {
        console.log('Featured video loading started');
    });
    
    video.addEventListener('loadeddata', function() {
        console.log('Featured video data loaded');
    });
    
    video.addEventListener('canplay', function() {
        console.log('Featured video can start playing');
    });
    
    video.addEventListener('error', function(e) {
        console.error('Featured video error:', e);
        console.error('Video error code:', video.error ? video.error.code : 'Unknown');
        
        // Show fallback message
        const fallbackMsg = video.querySelector('.video-fallback');
        if (fallbackMsg) {
            fallbackMsg.style.display = 'block';
            fallbackMsg.style.padding = '2rem';
            fallbackMsg.style.textAlign = 'center';
            fallbackMsg.style.background = 'rgba(255, 0, 0, 0.1)';
            fallbackMsg.style.border = '2px solid #ff6b6b';
            fallbackMsg.style.borderRadius = '10px';
            fallbackMsg.style.color = 'white';
        }
    });
    
    // Video container interactions
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
        // Show overlay when hovering over video container
        videoContainer.addEventListener('mouseenter', function() {
            if (video.paused || video.ended) {
                videoOverlay.style.opacity = '1';
            }
        });
        
        // Hide overlay when leaving (only if video is playing)
        videoContainer.addEventListener('mouseleave', function() {
            if (!video.paused && !video.ended) {
                videoOverlay.style.opacity = '0';
            }
        });
        
        // Click anywhere on video to play/pause (in addition to the button)
        video.addEventListener('click', function(e) {
            e.preventDefault();
            if (video.paused || video.ended) {
                video.play().then(() => {
                    updateButtonState();
                }).catch((error) => {
                    console.error('Error playing video via video click:', error);
                });
            } else {
                video.pause();
                updateButtonState();
            }
        });
    }
    
    // Initialize button state on load
    updateButtonState();
    
    // Keyboard controls for accessibility
    video.addEventListener('keydown', function(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                video.currentTime += 10; // Skip forward 10 seconds
                break;
            case 'ArrowLeft':
                e.preventDefault();
                video.currentTime -= 10; // Skip backward 10 seconds
                break;
        }
    });
    
    // Make video focusable for keyboard navigation
    video.setAttribute('tabindex', '0');
    
    console.log('Featured video initialization complete');
    
    // Debug function for testing (can be called from console)
    window.testVideoButton = function() {
        console.log('=== VIDEO BUTTON DEBUG TEST ===');
        console.log('Video paused:', video.paused);
        console.log('Video ended:', video.ended);
        console.log('Button element:', customPlayBtn);
        console.log('Overlay element:', videoOverlay);
        console.log('Button icon:', customPlayBtn.querySelector('i'));
        console.log('Video src:', video.currentSrc);
        console.log('=== END DEBUG TEST ===');
        
        // Try to toggle video manually
        if (video.paused || video.ended) {
            console.log('Attempting to play video...');
            video.play();
        } else {
            console.log('Attempting to pause video...');
            video.pause();
        }
    };
    
    console.log('Run testVideoButton() in console to debug the video controls');
}

/**
 * Initialize video background (no controls) - Enhanced debugging version
 */
function initializeVideoBackground() {
    const video = document.getElementById('heroVideo');
    
    if (!video) {
        // Video element only exists on homepage, silently skip on other pages
        return;
    }
    
    console.log('Video element found, initializing...');
    console.log('Video element:', video);
    console.log('Video src:', video.currentSrc || video.src);
    
    // Video is working properly, no debugging needed
    
    // Check video readiness
    video.addEventListener('loadstart', function() {
        console.log('Video loading started');
    });
    
    video.addEventListener('loadeddata', function() {
        console.log('Video data loaded');
    });
    
    video.addEventListener('loadedmetadata', function() {
        console.log('Video metadata loaded successfully');
        console.log('Video duration:', video.duration);
        console.log('Video dimensions:', video.videoWidth + 'x' + video.videoHeight);
    });
    
    video.addEventListener('canplay', function() {
        console.log('Video can start playing');
        video.play().catch(e => {
            console.warn('Video auto-play failed:', e);
        });
    });
    
    video.addEventListener('canplaythrough', function() {
        console.log('Video can play through without buffering');
    });
    
    video.addEventListener('play', function() {
        console.log('Video started playing');
    });
    
    video.addEventListener('playing', function() {
        console.log('Video is actually playing now');
    });
    
    video.addEventListener('pause', function() {
        console.log('Video paused');
    });
    
    video.addEventListener('ended', function() {
        console.log('Video ended');
    });
    
    // Handle video loading errors with detailed info
    video.addEventListener('error', function(e) {
        console.error('Video loading error:', e);
        console.error('Video error code:', video.error?.code);
        console.error('Video error message:', video.error?.message);
        console.error('Check if the video file "أولمبياد الكيمياء.mp4" exists in the project root');
        
        // Show fallback background
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
        }
    });
    
    video.addEventListener('stalled', function() {
        console.warn('Video playback stalled');
    });
    
    video.addEventListener('waiting', function() {
        console.log('Video is waiting for data');
    });
    
    // Try multiple approaches to start video
    const attemptPlay = () => {
        if (video.paused) {
            console.log('Attempting to play video...');
            video.play().then(() => {
                console.log('Video play successful');
            }).catch(e => {
                console.warn('Video play failed:', e.message);
                // Try with user interaction
                if (e.name === 'NotAllowedError') {
                    console.log('Adding click-to-play functionality...');
                    const playHandler = () => {
                        video.play().then(() => {
                            console.log('Video started after user interaction');
                        }).catch(err => {
                            console.error('Video still failed after user interaction:', err);
                        });
                        document.removeEventListener('click', playHandler);
                        document.removeEventListener('touchstart', playHandler);
                    };
                    document.addEventListener('click', playHandler);
                    document.addEventListener('touchstart', playHandler);
                }
            });
        }
    };
    
    // Try to play immediately
    attemptPlay();
    
    // Try again after a delay
    setTimeout(attemptPlay, 1000);
    
    // Try again after another delay
    setTimeout(attemptPlay, 3000);
    
    // Pause video when it's not visible (for performance)
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Video is visible, attempting play');
                    attemptPlay();
                } else {
                    console.log('Video is not visible, pausing');
                    video.pause();
                }
            });
        }, { threshold: 0.25 });
        
        videoObserver.observe(video);
    }
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            video.pause();
        } else {
            console.log('Page visible again, attempting video play');
            attemptPlay();
        }
    });
    
    // Optimize for mobile devices
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log('Mobile device detected, applying optimizations');
        video.style.filter = 'brightness(0.6) contrast(1.0)';
        video.playbackRate = 0.9;
    }
}

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