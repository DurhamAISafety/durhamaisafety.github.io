import { initializeDarkMode } from './dark-mode';
import { initializeSmoothScrolling } from './smooth-scroll';
import { initializeFormHandling } from './form-handling';
import { initializeScrollAnimations } from './scroll-animations';

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
function initializeCommonFeatures(): void {
  initializeDarkMode();
  initializeSmoothScrolling();
  initializeFormHandling();
  initializeScrollAnimations();
}
