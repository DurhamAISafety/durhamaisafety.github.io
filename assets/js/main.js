/**
 * Durham AISI Website JavaScript
 * Common functionality shared across all pages
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeCommonFeatures();
});

/**
 * Initialize all common features
 */
function initializeCommonFeatures() {
    initializeSmoothScrolling();
    initializeFormHandling();
    initializeBackToTop();
    initializeAnalytics();
    // Animate elements as they enter the viewport
    initializeScrollAnimations();
    initializeNavDropdowns();
}

/**
 * Smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            // Skip if it's just '#' (no target id) to avoid SyntaxError in querySelector('#')
            if (!href || href === '#') {
                return; // Could optionally scroll to top or do nothing
            }
            // Extract the id (supports fragments like '#section')
            const id = href.slice(1);
            if (!id) return;
            // Use attribute selector to be safer; escape not strictly needed for simple ids
            const target = document.getElementById(id) || document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Handle form submissions
 */
function initializeFormHandling() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmission);
    });
}

/**
 * Form submission handler
 * @param {Event} e - The form submission event
 */
function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showNotification('Thank you for your interest! We will be in touch soon.', 'success');
        
        // Reset form
        form.reset();
    }, 1000);
}

/**
 * Initialize back to top button
 * DISABLED - using footer link instead
 */
function initializeBackToTop() {
    // Disabled - back to top link is now in the footer
}

/**
 * Show notification to user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Initialize analytics (placeholder for future implementation)
 */
function initializeAnalytics() {
    // Track page views
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_TRACKING_ID', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
    
    // Track button clicks
    document.querySelectorAll('.btn, .nav-link').forEach(element => {
        element.addEventListener('click', function() {
            const action = this.textContent.trim();
            console.log('User clicked:', action);
            // Add actual analytics tracking here
        });
    });
}

/**
 * Utility function to debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
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
 * Utility function to check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean} Whether element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Animate elements when they come into view
 */
function initializeScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize navigation dropdowns for mobile (tap interaction)
 * Ensures the 'More' link (href="#") toggles its dropdown instead of navigating
 */
function initializeNavDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    const openDropdowns = new Set();
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-content');
        if (!toggle || !menu) return;

        // For accessibility
        if (toggle.tagName.toLowerCase() !== 'button') {
            toggle.setAttribute('role', 'button');
        }
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-haspopup', 'true');

        // Click / tap handler
        toggle.addEventListener('click', (e) => {
            // Prevent default if it was an anchor previously
            if (toggle.tagName.toLowerCase() === 'a') {
                const href = toggle.getAttribute('href');
                if (!href || href === '#') e.preventDefault();
            }

            const isOpen = menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            if (isOpen) {
                openDropdowns.add(dropdown);
                // Focus first link for keyboard users
                const firstLink = menu.querySelector('a');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 10);
                }
            } else {
                openDropdowns.delete(dropdown);
            }
        });

        // Close when clicking outside (mobile / any viewport)
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                if (menu.classList.contains('open')) {
                    menu.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                    openDropdowns.delete(dropdown);
                }
            }
        });
    });

    // Close all dropdowns on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            openDropdowns.forEach(d => {
                const t = d.querySelector('.dropdown-toggle');
                const m = d.querySelector('.dropdown-content');
                if (m && m.classList.contains('open')) {
                    m.classList.remove('open');
                    if (t) t.setAttribute('aria-expanded', 'false');
                }
            });
            openDropdowns.clear();
        }
    });
}

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeCommonFeatures,
        showNotification,
        debounce,
        isInViewport
    };
}
