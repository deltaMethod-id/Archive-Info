document.addEventListener('DOMContentLoaded', () => {
  const anchor = document.querySelector('a');
  if (anchor) {
    anchor.addEventListener('mouseenter', () => {
      anchor.style.transform = 'translateY(-2px)';
    });
  }
});
