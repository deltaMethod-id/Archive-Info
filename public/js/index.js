document.addEventListener('DOMContentLoaded', () => {
  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const cards = document.querySelectorAll('.archive-card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      cards.forEach((item) => item.classList.remove('featured'));
      card.classList.add('featured');
    });
  });
});
