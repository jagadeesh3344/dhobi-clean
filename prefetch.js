// Dhobiclean Instant Page Prefetcher & Performance Accelerator
(function() {
  'use strict';

  const prefetchedUrls = new Set();

  function prefetch(url) {
    if (!url || prefetchedUrls.has(url)) return;
    if (url.startsWith('#') || url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')) return;
    
    prefetchedUrls.add(url);
    
    // Modern prefetch link tag
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    document.head.appendChild(link);
  }

  function initPrefetch() {
    // Add hover / touch listeners to all internal links
    const links = document.querySelectorAll('a[href$=".html"], nav a, .footer-col a');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http')) return;

      // Prefetch on mouseenter or touchstart
      link.addEventListener('mouseenter', () => prefetch(href), { passive: true });
      link.addEventListener('touchstart', () => prefetch(href), { passive: true });
      link.addEventListener('focus', () => prefetch(href), { passive: true });
    });

    // Also warm up navigation links idle after 1 second
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        ['index.html', 'about.html', 'services.html', 'blog.html', 'contact.html'].forEach(page => {
          if (!window.location.pathname.endsWith(page)) {
            prefetch(page);
          }
        });
      }, { timeout: 2000 });
    } else {
      setTimeout(() => {
        ['index.html', 'about.html', 'services.html', 'blog.html', 'contact.html'].forEach(page => {
          if (!window.location.pathname.endsWith(page)) {
            prefetch(page);
          }
        });
      }, 1200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrefetch);
  } else {
    initPrefetch();
  }
})();
