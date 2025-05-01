/**
 * JustChill - Main JavaScript
 * Optimized version with performance improvements
 */

// DOM Elements Cache
const DOM = {
  body: document.body,
  themeToggle: document.getElementById('themeToggle'),
  searchContainer: document.getElementById('searchContainer'),
  searchInput: document.getElementById('searchInput'),
  searchButton: document.getElementById('searchButton'),
  searchResults: document.getElementById('searchResults'),
  mobileSearchButton: document.getElementById('mobileSearchButton'),
  mobileSearchContainer: document.getElementById('mobileSearchContainer'),
  mobileSearchInput: document.getElementById('mobileSearchInput'),
  closeMobileSearch: document.getElementById('closeMobileSearch'),
  mobileSearchResults: document.getElementById('mobileSearchResults'),
  settingsButton: document.getElementById('settingsButton'),
  settingsDropdown: document.getElementById('settingsDropdown'),
  recentRow: document.getElementById('recentRow'),
  trendingRow: document.getElementById('trendingRow'),
  popularRow: document.getElementById('popularRow'),
  topRatedRow: document.getElementById('topRatedRow'),
  upcomingRow: document.getElementById('upcomingRow'),
  awardRow: document.getElementById('awardRow'),
  detailModal: document.getElementById('detailModal'),
  playerModal: document.getElementById('playerModal')
};

// Site Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSearch();
  initNavigation();
  initContentRows();
  initServiceWorker();
  initLazyLoading();
  observeElements();
});

// Initialize theme based on user preference
function initTheme() {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    DOM.body.classList.remove('dark');
    DOM.body.classList.add('light');
  } else if (savedTheme === 'dark') {
    DOM.body.classList.remove('light');
    DOM.body.classList.add('dark');
  } else {
    // Use system preference as default
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      DOM.body.classList.remove('dark');
      DOM.body.classList.add('light');
    }
  }

  // Theme toggle functionality
  if (DOM.themeToggle) {
    DOM.themeToggle.addEventListener('click', toggleTheme);
  }
}

// Toggle between light and dark themes
function toggleTheme() {
  if (DOM.body.classList.contains('dark')) {
    DOM.body.classList.remove('dark');
    DOM.body.classList.add('light');
    localStorage.setItem('theme', 'light');
  } else {
    DOM.body.classList.remove('light');
    DOM.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

// Initialize search functionality
function initSearch() {
  // Desktop search
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('input', debounce(performSearch, 300));
    document.addEventListener('click', (e) => {
      if (!DOM.searchContainer.contains(e.target)) {
        DOM.searchResults.innerHTML = '';
      }
    });
  }

  // Mobile search
  if (DOM.mobileSearchButton) {
    DOM.mobileSearchButton.addEventListener('click', () => {
      DOM.mobileSearchContainer.classList.remove('hidden');
      DOM.mobileSearchInput.focus();
    });
  }

  if (DOM.closeMobileSearch) {
    DOM.closeMobileSearch.addEventListener('click', () => {
      DOM.mobileSearchContainer.classList.add('hidden');
      DOM.mobileSearchResults.innerHTML = '';
    });
  }

  if (DOM.mobileSearchInput) {
    DOM.mobileSearchInput.addEventListener('input', debounce(performMobileSearch, 300));
  }
}

// Perform search (desktop)
function performSearch() {
  const query = DOM.searchInput.value.trim();
  if (query.length < 2) {
    DOM.searchResults.innerHTML = '';
    return;
  }

  // TODO: Implement actual search API call
  // For now, simulate search results
  const mockResults = getMockSearchResults(query);
  displaySearchResults(mockResults, DOM.searchResults);
}

// Perform search (mobile)
function performMobileSearch() {
  const query = DOM.mobileSearchInput.value.trim();
  if (query.length < 2) {
    DOM.mobileSearchResults.innerHTML = '';
    return;
  }

  // TODO: Implement actual search API call
  const mockResults = getMockSearchResults(query);
  displaySearchResults(mockResults, DOM.mobileSearchResults);
}

// Display search results in the provided container
function displaySearchResults(results, container) {
  container.innerHTML = '';
  
  if (results.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'p-4 text-center text-secondary';
    noResults.textContent = 'No results found';
    container.appendChild(noResults);
    return;
  }

  results.forEach(result => {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-result-item flex items-center p-2 cursor-pointer hover:bg-gray-800';
    resultItem.innerHTML = `
      <img src="${result.poster}" alt="${result.title}" class="w-10 h-auto rounded mr-2">
      <div>
        <h4 class="font-medium">${result.title}</h4>
        <p class="text-xs text-secondary">${result.type} • ${result.year}</p>
      </div>
    `;
    resultItem.addEventListener('click', () => {
      // Handle result click
      openDetailModal(result.id);
    });
    container.appendChild(resultItem);
  });
}

// Mock search results for demonstration
function getMockSearchResults(query) {
  const allMockData = [
    { id: 1, title: 'The Last of Us', type: 'TV Series', year: '2023', poster: 'https://image.tmdb.org/t/p/original/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg' },
    { id: 2, title: 'Daredevil: Born Again', type: 'TV Series', year: '2024', poster: 'https://image.tmdb.org/t/p/original/9lLuhV703HGCbnz6FxnqCwIwzAZ.jpg' },
    { id: 3, title: 'In the Lost Lands', type: 'Movie', year: '2024', poster: 'https://image.tmdb.org/t/p/original/iHf6bXPghWB6gT8kFkL1zo00x6X.jpg' },
    { id: 4, title: 'Doctor Who', type: 'TV Series', year: '2005', poster: 'https://image.tmdb.org/t/p/original/2JP6NSmBwxg75uTcIHiv5R8PpPi.jpg' }
  ];
  
  query = query.toLowerCase();
  return allMockData.filter(item => 
    item.title.toLowerCase().includes(query) || 
    item.type.toLowerCase().includes(query) || 
    item.year.includes(query)
  );
}

// Initialize row navigation
function initNavigation() {
  // Settings dropdown
  if (DOM.settingsButton) {
    DOM.settingsButton.addEventListener('click', (e) => {
      e.stopPropagation();
      DOM.settingsDropdown.classList.toggle('hidden');
    });
    
    document.addEventListener('click', (e) => {
      if (!DOM.settingsButton.contains(e.target) && !DOM.settingsDropdown.contains(e.target)) {
        DOM.settingsDropdown.classList.add('hidden');
      }
    });
  }

  // Initialize slider navigation buttons
  const sliders = document.querySelectorAll('.row-container');
  sliders.forEach(slider => {
    const rowId = slider.dataset.row || Math.random().toString(36).substr(2, 9);
    const leftBtn = document.getElementById(`${rowId}Left`) || slider.querySelector('.row-nav-button:first-child');
    const rightBtn = document.getElementById(`${rowId}Right`) || slider.querySelector('.row-nav-button:last-child');
    const scrollContainer = slider.querySelector('.scroll-container');
    
    if (leftBtn && scrollContainer) {
      leftBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
      });
    }
    
    if (rightBtn && scrollContainer) {
      rightBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
      });
    }
  });
}

// Initialize content rows (lazy loading)
function initContentRows() {
  // This will be handled by the IntersectionObserver in observeElements()
}

// Initialize service worker for offline capabilities
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
}

// Initialize lazy loading for images
function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.loading = 'lazy';
    });
  } else {
    // Fallback to IntersectionObserver
    // This is handled in observeElements()
  }
}

// Use IntersectionObserver to lazy load elements
function observeElements() {
  if (!('IntersectionObserver' in window)) return;

  // Image lazy loading
  const imgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px' });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imgObserver.observe(img);
  });

  // Content row loading
  const rowObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const row = entry.target;
        // Load content for this row if not already loaded
        if (!row.classList.contains('loaded')) {
          // This would fetch and append content in a real implementation
          row.classList.add('loaded');
        }
        observer.unobserve(row);
      }
    });
  }, { rootMargin: '100px 0px' });

  document.querySelectorAll('.row-container').forEach(row => {
    rowObserver.observe(row);
  });
}

// Utility: Debounce function for search input
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Open detail modal with content based on ID
function openDetailModal(id) {
  if (!DOM.detailModal) return;
  
  // TODO: Fetch details based on ID
  // For demo, just show modal with hard-coded content
  DOM.detailModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// For modal closing
window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
};

// Export functions for external access
window.JustChill = {
  toggleTheme,
  openDetailModal,
  closeModal
};
