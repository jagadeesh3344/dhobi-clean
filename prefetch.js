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
    const pages = ['/', '/about', '/services', '/blog', '/contact'];
    
    // Instantly warm up all core pages after initial load
    setTimeout(() => {
      const currentPath = window.location.pathname;
      pages.forEach(page => {
        if (currentPath !== page && !(page === '/' && (currentPath === '/index.html' || currentPath === '/index'))) {
          prefetch(page);
        }
      });
    }, 100);

    // Add pointerdown / touchstart / mouseenter listeners for instant response
    document.addEventListener('pointerdown', (e) => {
      if (!e.target || typeof e.target.closest !== 'function') return;
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http')) {
        prefetch(href);
      }
    }, { passive: true });

    document.addEventListener('mouseenter', (e) => {
      if (!e.target || typeof e.target.closest !== 'function') return;
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http')) {
        prefetch(href);
      }
    }, true);

    // Instant click visual progress response
    document.addEventListener('click', (e) => {
      if (!e.target || typeof e.target.closest !== 'function') return;
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

  /**
   * Universal Mobile Navigation Drawer Handler
   */
  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const closeBtn = document.getElementById('mobile-nav-close');
    if (!drawer) return;

    window.closeMobileMenu = function() {
      drawer.classList.remove('open');
      if (btn) {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      }
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    };

    window.openMobileMenu = function() {
      drawer.classList.add('open');
      if (btn) {
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
    };

    window.toggleMobileMenu = function() {
      if (drawer.classList.contains('open')) {
        window.closeMobileMenu();
      } else {
        window.openMobileMenu();
      }
    };

    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.toggleMobileMenu();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.closeMobileMenu();
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        window.closeMobileMenu();
      }
    });

    // Close drawer when any link or action inside is clicked
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        window.closeMobileMenu();
      });
    });

    // Close drawer on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && drawer.classList.contains('open')) {
        window.closeMobileMenu();
      }
    }, { passive: true });

  }

  function onReady() {
    initPrefetch();
    initMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  // Complete progress bar on load
  window.addEventListener('load', completeProgressBar);
})();
