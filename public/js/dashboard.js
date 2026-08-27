document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.stat-box');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 120}ms`;
    card.style.animation = 'pulse 1.6s ease-in-out infinite alternate';
  });
});
