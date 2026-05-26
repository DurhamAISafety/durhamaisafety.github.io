/**
 * Form submission handling and toast notifications module
 */
export function initializeFormHandling(): void {
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    form.addEventListener('submit', handleFormSubmission);
  });
}

function handleFormSubmission(e: Event): void {
  e.preventDefault();

  const form = e.currentTarget as HTMLFormElement;
  const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  if (!submitButton) return;

  const originalText = submitButton.textContent ?? '';
  submitButton.textContent = 'Submitting...';
  submitButton.disabled = true;

  // Simulate form submission
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
 * Show temporary alert notification popup
 */
export function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Show with subtle CSS transition
  setTimeout(() => notification.classList.add('show'), 100);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}
