/**
 * DAISI Website JavaScript
 * Common functionality shared across all pages
 */

// Robust DOM ready: run immediately if DOM is already parsed, otherwise on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeCommonFeatures();
    }, { once: true });
} else {
    initializeCommonFeatures();
}

/**
 * Initialize all common features
 */
function initializeCommonFeatures() {
    initializeDarkMode();
    initializeSmoothScrolling();
    initializeFormHandling();
    // Back-to-top is provided by the footer link; no floating button injected here.
    initializeAnalytics();
    // Animate elements as they enter the viewport
    initializeScrollAnimations();
    initializeNavDropdowns();
}

/**
 * Dark mode — toggle via .dark class on <html>.
 * Persists preference to localStorage; respects system preference as default.
 * localStorage access is guarded against restricted contexts (private browsing,
 * sandboxed iframes) where it can throw. matchMedia.addEventListener falls back
 * to the deprecated addListener for older Safari compatibility.
 */
function initializeDarkMode() {
    const html = document.documentElement;

    function storageGet(key) {
        try { return localStorage.getItem(key); } catch (_) { return null; }
    }
    function storageSet(key, val) {
        try { localStorage.setItem(key, val); } catch (_) { /* ignore */ }
    }

    const stored = storageGet('theme');
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const prefersDark = mq.matches;
    const isDark = stored ? stored === 'dark' : prefersDark;

    if (isDark) html.classList.add('dark');
    updateDarkModeIcon(isDark);

    // Wire up all toggle buttons (desktop + mobile)
    document.querySelectorAll('.dark-mode-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const nowDark = html.classList.toggle('dark');
            storageSet('theme', nowDark ? 'dark' : 'light');
            updateDarkModeIcon(nowDark);
        });
    });

    // Follow system preference changes if user hasn't manually set a preference.
    // addEventListener on MediaQueryList is standard but addListener is the
    // fallback for older Safari (pre-14).
    function onSchemeChange(e) {
        if (!storageGet('theme')) {
            html.classList.toggle('dark', e.matches);
            updateDarkModeIcon(e.matches);
        }
    }
    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', onSchemeChange);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(onSchemeChange);
    }
}

function updateDarkModeIcon(isDark) {
    document.querySelectorAll('.dark-mode-toggle i').forEach(icon => {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
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
        element.addEventListener('click', function () {
            const action = this.textContent.trim();
            console.log('User clicked:', action);
            // Add actual analytics tracking here
        });
    });
}

// (Removed unused helpers: debounce, isInViewport)

/**
 * Animate elements when they come into view.
 * Uses .reveal + .visible CSS pattern with --reveal-delay custom property for stagger.
 */
function initializeScrollAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealElements = document.querySelectorAll('.reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        // Skip animation — make everything visible immediately
        revealElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // fire once
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
    });

    revealElements.forEach(el => revealObserver.observe(el));
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
        showNotification
    };
}
