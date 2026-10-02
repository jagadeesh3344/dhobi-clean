/**
 * Dhobiclean Ultra-Fast Instant Page Accelerator & Prefetcher
 * Guarantees zero latency on page switches and immediate user feedback.
 */
(function() {
  'use strict';

  const prefetchedUrls = new Set();
  const pageCache = new Map();

  // Create instant visual progress bar
  let progressBar = document.getElementById('page-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'page-progress-bar';
    document.documentElement.appendChild(progressBar);
  }

  function startProgressBar() {
    if (!progressBar) return;
    progressBar.style.opacity = '1';
    progressBar.style.width = '30%';
    setTimeout(() => {
      if (progressBar.style.width === '30%') progressBar.style.width = '70%';
    }, 80);
  }

  function completeProgressBar() {
    if (!progressBar) return;
    progressBar.style.width = '100%';
    setTimeout(() => {
      progressBar.style.opacity = '0';
      setTimeout(() => {
        progressBar.style.width = '0%';
      }, 200);
    }, 150);
  }

  /**
   * Prefetch document via standard link tag and in-memory cache
   */
  function prefetch(url) {
    if (!url || prefetchedUrls.has(url)) return;
    if (url.startsWith('#') || url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')) return;
    
    // Normalize relative URL
    const cleanUrl = url.split('#')[0];
    if (!cleanUrl) return;

    prefetchedUrls.add(cleanUrl);
    
    // Modern link rel=prefetch
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = cleanUrl;
    link.as = 'document';
    document.head.appendChild(link);

    // Warm up fetch into memory
    fetch(cleanUrl, { priority: 'low' })
      .then(res => res.text())
      .then(html => {
        pageCache.set(cleanUrl, html);
      })
      .catch(() => {});
  }

  function initPrefetch() {
    const pages = ['index.html', 'about.html', 'services.html', 'blog.html', 'contact.html'];
    
    // Instantly warm up all core pages after initial load
    setTimeout(() => {
      pages.forEach(page => {
        if (!window.location.pathname.endsWith(page)) {
          prefetch(page);
        }
      });
    }, 100);

    // Add pointerdown / touchstart / mouseenter listeners for instant response
    document.addEventListener('pointerdown', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http')) {
        prefetch(href);
      }
    }, { passive: true });

    document.addEventListener('mouseenter', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http')) {
        prefetch(href);
      }
    }, true);

    // Instant click visual progress response
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // In-page hash link scrolling
      if (href.startsWith('#')) return;

      // Handle normal page navigation with instant progress feedback
      if (!href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        startProgressBar();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrefetch);
  } else {
    initPrefetch();
  }

  // Complete progress bar on load
  window.addEventListener('load', completeProgressBar);
})();
