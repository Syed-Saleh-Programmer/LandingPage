// DOM Elements
const downloadBtn = document.getElementById('downloadBtn');
const mainDownloadBtn = document.getElementById('mainDownloadBtn');
const navDownloadBtn = document.getElementById('navDownloadBtn');
const watchDemo = document.getElementById('watchDemo');
const playOverlayBtn = document.getElementById('playOverlayBtn');
const demoModal = document.getElementById('demoModal');
const closeModal = document.getElementById('closeModal');
const navMobileToggle = document.querySelector('.nav-mobile-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.getElementById('themeToggle');

// Chrome Web Store URL (replace with actual URL when published)
const CHROME_STORE_URL = 'https://chrome.google.com/webstore/detail/heypost-editor/your-extension-id';

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    getPreferredTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle button aria-label
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Track theme change
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                'event_category': 'UI',
                'event_label': newTheme
            });
        }
    }

    bindEvents() {
        // Theme toggle button
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });

        // Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Download button functionality
function handleDownload() {
    // Track download attempt
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'Extension',
            'event_label': 'Download Attempt'
        });
    }
    
    // For now, show alert since extension isn't published yet
    alert('Extension is currently in development. Chrome Web Store link coming soon!');
    
    // When ready, uncomment the line below:
    // window.open(CHROME_STORE_URL, '_blank');
}

// Event listeners for download buttons
if (downloadBtn) {
    downloadBtn.addEventListener('click', handleDownload);
}

if (mainDownloadBtn) {
    mainDownloadBtn.addEventListener('click', handleDownload);
}

if (navDownloadBtn) {
    navDownloadBtn.addEventListener('click', handleDownload);
}

// Demo modal functionality
function openDemoModal() {
    if (demoModal) {
        demoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

if (watchDemo && demoModal && closeModal) {
    watchDemo.addEventListener('click', openDemoModal);
}

// Play overlay button functionality
if (playOverlayBtn) {
    playOverlayBtn.addEventListener('click', openDemoModal);
}

if (closeModal && demoModal) {
    closeModal.addEventListener('click', () => {
        demoModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    demoModal.addEventListener('click', (e) => {
        if (e.target === demoModal) {
            demoModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && demoModal.classList.contains('active')) {
            demoModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Mobile navigation toggle
if (navMobileToggle && navLinks) {
    navMobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navMobileToggle.classList.toggle('active');
    });
}

// Navbar scroll effect
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow when scrolled
    if (scrollTop > 10) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.feature-card, .testimonial-card, .step, .hero-content, .hero-visual'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(start));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K+';
    }
    return num.toString();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('10,000+')) {
                    animateCounter(stat, 10000);
                } else if (text.includes('4.8/5')) {
                    stat.textContent = '4.8/5';
                } else if (text.includes('50+')) {
                    animateCounter(stat, 50);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Form validation and submission (if you add a contact form later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Error handling for missing elements
function safeAddEventListener(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
    }
}

// Initialize tooltips (if you add them later)
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', showTooltip);
        tooltip.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltipText = e.target.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Performance optimization: Debounce scroll events
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

// Optimized scroll handler
const handleScroll = debounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 10) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
}, 10);

window.addEventListener('scroll', handleScroll);

// Lazy loading for images (if you add more images)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize lazy loading
    lazyLoadImages();
    
    // Initialize tooltips
    initTooltips();
    
    // Add loading class removal
    document.body.classList.add('loaded');
});

// Handle browser back/forward navigation
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.section) {
        const section = document.getElementById(e.state.section);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add state to browser history for smooth navigation
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const sectionId = e.target.getAttribute('href').substring(1);
        if (sectionId) {
            history.pushState({ section: sectionId }, '', `#${sectionId}`);
        }
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Handle keyboard navigation for modal
    if (demoModal && demoModal.classList.contains('active')) {
        if (e.key === 'Tab') {
            // Keep focus within modal
            const focusableElements = demoModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    }
});

// Testimonials Slider Management
class TestimonialsSlider {
    constructor() {
        this.track = document.getElementById('testimonialsTrack');
        this.isHovered = false;
        this.init();
    }

    init() {
        if (!this.track) return;
        
        this.bindEvents();
        this.setupInfiniteScroll();
    }

    bindEvents() {
        // Pause animation on hover
        this.track.addEventListener('mouseenter', () => {
            this.isHovered = true;
            this.track.style.animationPlayState = 'paused';
        });

        // Resume animation when hover ends
        this.track.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.track.style.animationPlayState = 'running';
        });

        // Handle touch events for mobile
        this.track.addEventListener('touchstart', () => {
            this.track.style.animationPlayState = 'paused';
        });

        this.track.addEventListener('touchend', () => {
            setTimeout(() => {
                if (!this.isHovered) {
                    this.track.style.animationPlayState = 'running';
                }
            }, 1000);
        });
    }

    setupInfiniteScroll() {
        // Reset animation when it completes for seamless loop
        this.track.addEventListener('animationiteration', () => {
            if (!this.isHovered) {
                this.track.style.transform = 'translateX(0)';
            }
        });
    }
}

// Initialize testimonials slider
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsSlider();
});

// Console message for developers
console.log(`
🚀 HeyPost Editor Landing Page
📧 Contact: developer@heypost.com
🐛 Report issues: github.com/heypost/issues

✨ Features:
- 🌓 Theme switching (Ctrl/Cmd + Shift + T)
- 📱 Responsive design
- ♿ Accessibility support
- 🎠 Auto-scrolling testimonials slider

Thanks for checking out the code! 
We'd love to hear from developers interested in contributing.
`);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        formatNumber,
        debounce,
        ThemeManager
    };
}