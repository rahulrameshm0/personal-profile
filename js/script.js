// ===== UTILITY FUNCTIONS =====
const throttle = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// ===== MOBILE MENU FUNCTIONALITY =====
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const body = document.body;
const header = document.querySelector('.header');
const themeToggle = document.querySelector('#theme-toggle');
const themeStorageKey = 'rahul-portfolio-theme';
const systemTheme = window.matchMedia('(prefers-color-scheme: light)');

const getSavedTheme = () => {
  try {
    return window.localStorage.getItem(themeStorageKey);
  } catch (error) {
    return null;
  }
};

const setTheme = (theme) => {
  document.documentElement.dataset.theme = theme;

  if (themeToggle) {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const actionLabel = `Switch to ${nextTheme} mode`;
    themeToggle.setAttribute('aria-label', actionLabel);
    themeToggle.setAttribute('title', actionLabel);
    themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
  }
};

let savedTheme = getSavedTheme();
if (savedTheme !== 'light' && savedTheme !== 'dark') {
  savedTheme = null;
}
setTheme(savedTheme || (systemTheme.matches ? 'light' : 'dark'));

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    savedTheme = nextTheme;
    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch (error) {
      // Theme switching still works for this page when storage is unavailable.
    }
  });
}

const updateSystemTheme = (event) => {
  if (!savedTheme) {
    setTheme(event.matches ? 'light' : 'dark');
  }
};

if (systemTheme.addEventListener) {
  systemTheme.addEventListener('change', updateSystemTheme);
} else if (systemTheme.addListener) {
  systemTheme.addListener(updateSystemTheme);
}

let menuOpen = false;

const setMenuAccessibility = () => {
  if (menuBtn) {
    menuBtn.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
  }
  if (mobileMenu) {
    mobileMenu.setAttribute('aria-hidden', menuOpen ? 'false' : 'true');
  }
};

const setBodyScrollLocked = (locked) => {
  body.style.overflow = locked ? 'hidden' : '';
};

const toggleMobileMenu = () => {
  if (!menuOpen) {
    menuBtn.classList.add('active');
    mobileMenu.classList.add('is-visible');
    body.classList.add('blur');
    menuOpen = true;
    setBodyScrollLocked(true);
    if (header) {
      header.classList.remove('hidden');
    }
    setMenuAccessibility();
  } else {
    menuBtn.classList.remove('active');
    mobileMenu.classList.remove('is-visible');
    body.classList.remove('blur');
    menuOpen = false;
    setBodyScrollLocked(false);
    setMenuAccessibility();
  }
};

const closeMobileMenu = () => {
  if (menuOpen) {
    menuBtn.classList.remove('active');
    mobileMenu.classList.remove('is-visible');
    body.classList.remove('blur');
    menuOpen = false;
    setBodyScrollLocked(false);
    setMenuAccessibility();
  }
};

// Event listeners for mobile menu
if (menuBtn) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (menuOpen && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
    closeMobileMenu();
  }
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) {
    closeMobileMenu();
  }
});

// ===== HEADER SCROLL BEHAVIOR =====
let lastScrollTop = 0;
let scrollDirection = 'up';
let ticking = false;

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    scrollDirection = 'down';
  } else {
    scrollDirection = 'up';
  }

  lastScrollTop = scrollTop;

  // While the drawer is open, do not auto-hide the header (scroll still fires on some devices)
  if (menuOpen) {
    if (header) {
      header.classList.remove('hidden');
    }
    ticking = false;
    return;
  }

  if (!header) {
    ticking = false;
    return;
  }

  if (scrollTop > 100) {
    header.classList.add('scrolled');
    if (scrollDirection === 'down' && scrollTop > 200) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
  } else {
    header.classList.remove('scrolled');
    header.classList.remove('hidden');
  }

  ticking = false;
};

const requestTick = () => {
  if (!ticking) {
    requestAnimationFrame(handleScroll);
    ticking = true;
  }
};

window.addEventListener('scroll', requestTick);

// ===== SMOOTH SCROLLING =====
const smoothScrollTo = (target) => {
  const element = document.querySelector(target);
  if (element) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const elementPosition = element.offsetTop - headerHeight;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

// Handle navigation clicks
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = this.getAttribute('href');
    if (target !== '#') {
      smoothScrollTo(target);
      closeMobileMenu();
    }
  });
});

// ===== TABS FUNCTIONALITY =====
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');
const tabList = document.querySelector('.tab-list');

let activeTabIndex = 0;

const setActiveTab = (index) => {
  if (!tabButtons[index]) {
    return;
  }

  // Remove active state from all tabs
  tabButtons.forEach((btn, i) => {
    btn.setAttribute('aria-selected', 'false');
    btn.setAttribute('tabindex', '-1');
    const panel = document.getElementById(btn.getAttribute('aria-controls')) || tabPanels[i];
    if (panel) {
      panel.hidden = true;
    }
  });
  
  // Set active state for selected tab
  tabButtons[index].setAttribute('aria-selected', 'true');
  tabButtons[index].setAttribute('tabindex', '0');
  const activePanel = document.getElementById(tabButtons[index].getAttribute('aria-controls')) || tabPanels[index];
  if (activePanel) {
    activePanel.hidden = false;
  }
  
  // Move only the ::before indicator (not the whole tab list)
  if (tabList) {
    const btn = tabButtons[index];
    tabList.style.setProperty('--tab-height', `${btn.offsetHeight}px`);
    tabList.style.setProperty('--tab-index', String(index));
    tabList.style.removeProperty('transform');
  }
  
  activeTabIndex = index;
};

// Initialize tabs
if (tabButtons.length > 0) {
  setActiveTab(0);
  
  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      setActiveTab(index);
    });
    
    button.addEventListener('keydown', (e) => {
      let newIndex = activeTabIndex;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        newIndex = activeTabIndex > 0 ? activeTabIndex - 1 : tabButtons.length - 1;
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        newIndex = activeTabIndex < tabButtons.length - 1 ? activeTabIndex + 1 : 0;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = tabButtons.length - 1;
      }
      
      if (newIndex !== activeTabIndex) {
        e.preventDefault();
        setActiveTab(newIndex);
        tabButtons[newIndex].focus();
      }
    });
  });
}

// ===== SHOW MORE PROJECTS FUNCTIONALITY =====
const showMoreButton = document.querySelector('#showMoreButton');
const projectCards = document.querySelectorAll('.project-card');
const showMoreText = showMoreButton?.querySelector('.more-button-text');
const showMoreIcon = showMoreButton?.querySelector('.more-button-icon');

let showingMore = false;

const toggleProjects = () => {
  const hiddenProjects = Array.from(projectCards).slice(3);
  
  if (!showingMore) {
    hiddenProjects.forEach(project => {
      project.style.display = 'block';
      project.classList.add('just-revealed');
    });
    showMoreText.textContent = 'Show fewer projects';
    showMoreIcon.textContent = '↑';
    showMoreButton.setAttribute('aria-expanded', 'true');
    showingMore = true;
  } else {
    hiddenProjects.forEach(project => {
      project.style.display = 'none';
      project.classList.remove('just-revealed');
    });
    showMoreText.textContent = 'Show all projects';
    showMoreIcon.textContent = '↓';
    showMoreButton.setAttribute('aria-expanded', 'false');
    showingMore = false;
  }
};

if (showMoreButton) {
  showMoreButton.addEventListener('click', toggleProjects);
}

// ===== SCROLL REVEAL ANIMATIONS =====
// Apply scroll reveal only when the optional library is available.
if (typeof ScrollReveal === 'function') {
  const sr = ScrollReveal({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay: 200,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor: 0.25,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  sr.reveal('.hero h1', { delay: 100 });
  sr.reveal('.hero h2', { delay: 200 });
  sr.reveal('.hero h3', { delay: 300 });
  sr.reveal('.hero p', { delay: 400 });
  sr.reveal('.hero .email-link', { delay: 500 });
  
  sr.reveal('.numbered-heading', { delay: 100 });
  sr.reveal('.about-content > div', { delay: 200, interval: 100 });
  sr.reveal('.jobs-tabs', { delay: 200 });
  sr.reveal('.project', { delay: 200, interval: 100 });
  sr.reveal('.project-card', { delay: 200, interval: 100 });
  sr.reveal('#contact', { delay: 200 });
}

// ===== FOCUS MANAGEMENT =====
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const trapFocus = (element) => {
  const focusableContent = element.querySelectorAll(focusableElements);
  const firstFocusableElement = focusableContent[0];
  const lastFocusableElement = focusableContent[focusableContent.length - 1];

  document.addEventListener('keydown', function(e) {
    const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  });
};

// ===== RESIZE HANDLER =====
const handleResize = debounce(() => {
  // Update tab indicator position on resize
  if (tabButtons.length > 0) {
    setActiveTab(activeTabIndex);
  }
  
  // Close mobile menu on resize to desktop
  if (window.innerWidth > 768 && menuOpen) {
    closeMobileMenu();
  }
}, 250);

window.addEventListener('resize', handleResize);

// ===== PREFERS REDUCED MOTION =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Disable animations for users who prefer reduced motion
  document.documentElement.style.setProperty('--transition', 'none');
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .project, section').forEach(el => {
  observer.observe(el);
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  // Skip to content functionality
  if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
      skipLink.focus();
    }
  }
});

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  setMenuAccessibility();

  // Set initial states
  if (tabButtons.length > 0) {
    setActiveTab(0);
  }
  
  // Hide projects initially
  if (projectCards.length > 3) {
    Array.from(projectCards).slice(3).forEach(project => {
      project.style.display = 'none';
    });
  }
  
  // Add loaded class to body
  document.body.classList.add('loaded');
});

// ===== GLOBAL FUNCTIONS =====
window.closeMobileMenu = closeMobileMenu;

// ===== ANALYTICS =====
window.plausible =
  window.plausible ||
  function () {
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };

window.plausible("custom-pageview", {
  props: {
    domain: window.location.host,
  },
});
