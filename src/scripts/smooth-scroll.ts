/**
 * Smooth scrolling for page anchor links
 */
export function initializeSmoothScrolling(): void {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
      const href = this.getAttribute('href');
      // Skip if it's just '#' (no target id) to avoid SyntaxError
      if (!href || href === '#') {
        return;
      }
      
      e.preventDefault();
      
      // Extract the id (supports fragments like '#section')
      const id = href.slice(1);
      if (!id) return;
      
      const target = document.getElementById(id) || document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}
