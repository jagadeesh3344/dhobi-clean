/**
 * Dhobiclean - Blog Page Interactive Search & Subscription
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('blog-search-input');
  const blogCards = document.querySelectorAll('.blog-card-item');
  const noResults = document.getElementById('no-search-results');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let matchCount = 0;

      blogCards.forEach(card => {
        const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
        const tag = card.querySelector('.blog-tag-badge').textContent.toLowerCase();

        if (title.includes(query) || tag.includes(query)) {
          card.classList.remove('hidden');
          matchCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (noResults) {
        if (matchCount === 0) {
          noResults.classList.remove('hidden');
        } else {
          noResults.classList.add('hidden');
        }
      }
    });
  }
});

function handleBlogNewsletter(event) {
  event.preventDefault();
  const input = event.target.querySelector('input');
  if (input && input.value) {
    alert(`Thank you for subscribing with ${input.value}! You will receive our latest laundry care guides and exclusive deals.`);
    input.value = '';
  }
}
