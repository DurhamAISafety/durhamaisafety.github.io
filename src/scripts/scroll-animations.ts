/**
 * Viewport scroll reveals module utilizing IntersectionObserver
 */
export function initializeScrollAnimations(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');
  const isIframe = window.parent !== window;

  const makeVisible = (el: HTMLElement): void => {
    el.classList.add('visible');
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.animation = 'none';
    el.style.transition = 'none';
  };

  if (prefersReducedMotion || !('IntersectionObserver' in window) || isIframe) {
    // Skip animation — make everything visible immediately
    revealElements.forEach((el) => makeVisible(el as HTMLElement));

    // Watch for newly added elements (e.g. from Tina CMS live-preview updates)
    if ('MutationObserver' in window) {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const elementNode = node as HTMLElement;
              if (elementNode.classList.contains('reveal')) {
                makeVisible(elementNode);
              }
              elementNode.querySelectorAll('.reveal').forEach((el) => makeVisible(el as HTMLElement));
            }
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // fire once
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Watch for dynamically added elements in standard viewport to trigger reveal observer
  if ('MutationObserver' in window) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const elementNode = node as HTMLElement;
            if (elementNode.classList.contains('reveal')) {
              revealObserver.observe(elementNode);
            }
            elementNode.querySelectorAll('.reveal').forEach((el) => {
              revealObserver.observe(el);
            });
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}
