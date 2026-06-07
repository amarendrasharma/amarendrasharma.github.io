document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTimeGradient();
  initTitleReveal();
  initGooeyHover();
  initCopyEmail();
  initSectionTabs();
  initScrollAnimations();
  initCursor();
  initAvailabilityBadge();
});

/**
 * Dark/Light Theme Manager
 */
function initTheme() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const userTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply initial theme
  if (userTheme === 'dark' || (!userTheme && systemDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Set up click handlers
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
      initTimeGradient(); // Re-apply gradients that are dark-sensitive
    });
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      initTimeGradient();
    }
  });
}

/**
 * Dynamic Time-of-Day Ambient Gradient
 */
function initTimeGradient() {
  const hours = new Date().getHours();
  const isDark = document.documentElement.classList.contains('dark');
  
  // Morning (5am - 11am) — soft rose-lavender dawn
  if (hours >= 5 && hours < 11) {
    if (isDark) {
      document.documentElement.style.setProperty('--gradient-top', 
        'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(244, 114, 182, 0.18) 0%, rgba(167, 139, 250, 0.10) 50%, transparent 100%)');
    } else {
      document.documentElement.style.setProperty('--gradient-top', 
        'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(251, 207, 232, 0.55) 0%, rgba(221, 214, 254, 0.25) 60%, transparent 100%)');
    }
  } 
  // Midday (11am - 5pm) — electric indigo-violet
  else if (hours >= 11 && hours < 17) {
    if (isDark) {
      document.documentElement.style.setProperty('--gradient-top', 
        'radial-gradient(ellipse 90% 45% at 50% -15%, rgba(139, 92, 246, 0.28) 0%, rgba(79, 70, 229, 0.14) 45%, rgba(55, 48, 163, 0.05) 75%, transparent 100%)');
    } else {
      document.documentElement.style.setProperty('--gradient-top', 
        'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(139, 92, 246, 0.22) 0%, rgba(99, 82, 219, 0.10) 45%, rgba(79, 70, 229, 0.04) 70%, transparent 100%)');
    }
  } 
  // Sunset / Evening (5pm - 9pm) — amber-violet dusk
  else if (hours >= 17 && hours < 21) {
    if (isDark) {
      document.documentElement.style.setProperty('--gradient-top', 
        'radial-gradient(ellipse 85% 40% at 50% -10%, rgba(249, 115, 22, 0.14) 0%, rgba(167, 85, 247, 0.08) 50%, transparent 100%)');
    } else {
      document.documentElement.style.setProperty('--gradient-top', 
        'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(253, 186, 116, 0.45) 0%, rgba(216, 180, 254, 0.30) 55%, transparent 100%)');
    }
  } 
  // Cosmic Night (9pm - 5am) — deep violet nebula
  else {
    if (isDark) {
      document.documentElement.style.setProperty('--gradient-top', 
        'radial-gradient(ellipse 90% 50% at 50% -15%, rgba(109, 40, 217, 0.22) 0%, rgba(167, 139, 250, 0.10) 50%, transparent 100%)');
    } else {
      document.documentElement.style.setProperty('--gradient-top', 
        'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(196, 181, 253, 0.45) 0%, rgba(221, 214, 254, 0.22) 60%, transparent 100%)');
    }
  }
}

/**
 * Character-by-character title reveal animation
 */
function initTitleReveal() {
  const titles = document.querySelectorAll('.reveal-title');
  
  titles.forEach(title => {
    const text = title.textContent.trim();
    title.innerHTML = '';
    
    // Split words, then characters
    const words = text.split(' ');
    let globalCharIndex = 0;
    
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      
      [...word].forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char';
        charSpan.style.animationDelay = `${globalCharIndex * 0.04}s`;
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
        globalCharIndex++;
      });
      
      title.appendChild(wordSpan);
      
      // Add space between words (except the last one)
      if (wordIndex < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.style.display = 'inline-block';
        spaceSpan.innerHTML = '&nbsp;';
        title.appendChild(spaceSpan);
      }
    });
  });
}

/**
 * Gooey Glide selection highlight for navigation & case studies lists
 */
function initGooeyHover() {
  const containers = document.querySelectorAll('.gooey-container');
  
  containers.forEach(container => {
    // Check or create background element
    let gooeyBg = container.querySelector('.gooey-bg');
    if (!gooeyBg) {
      gooeyBg = document.createElement('div');
      gooeyBg.className = 'gooey-bg';
      container.appendChild(gooeyBg);
    }
    
    const items = container.querySelectorAll('.gooey-item');
    
    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        // Compute relative positions
        const itemRect = item.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const top = itemRect.top - containerRect.top;
        const left = itemRect.left - containerRect.left;
        const width = itemRect.width;
        const height = itemRect.height;
        
        // Apply transform & sizes
        gooeyBg.style.width = `${width}px`;
        gooeyBg.style.height = `${height}px`;
        gooeyBg.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        gooeyBg.style.opacity = '1';
      });
    });
    
    container.addEventListener('mouseleave', () => {
      gooeyBg.style.opacity = '0';
    });
  });
}

/**
 * Copy email clipboard utility with feedback
 */
function initCopyEmail() {
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const email = btn.getAttribute('data-email') || 's.amarendra1995@gmail.com';
      const labelEl = btn.querySelector('.copy-label') || btn;
      const originalText = labelEl.textContent;
      
      // Select icons
      const copyIcon = btn.querySelector('.copy-icon');
      const checkIcon = btn.querySelector('.check-icon');
      
      try {
        await navigator.clipboard.writeText(email);
        
        // Show success state
        labelEl.textContent = 'Email copied!';
        btn.classList.add('border-emerald-500', 'text-emerald-600', 'dark:text-emerald-400');
        
        if (copyIcon && checkIcon) {
          copyIcon.classList.add('opacity-0', 'scale-75');
          copyIcon.classList.remove('opacity-100', 'scale-100');
          checkIcon.classList.add('opacity-100', 'scale-100');
          checkIcon.classList.remove('opacity-0', 'scale-75');
        }
        
        // Reset state after 2 seconds
        setTimeout(() => {
          labelEl.textContent = originalText;
          btn.classList.remove('border-emerald-500', 'text-emerald-600', 'dark:text-emerald-400');
          
          if (copyIcon && checkIcon) {
            copyIcon.classList.add('opacity-100', 'scale-100');
            copyIcon.classList.remove('opacity-0', 'scale-75');
            checkIcon.classList.add('opacity-0', 'scale-75');
            checkIcon.classList.remove('opacity-100', 'scale-100');
          }
        }, 2000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    });
  });
}

/**
 * Tab Section Switcher with fade-in ease animations
 */
function initSectionTabs() {
  const sections = document.querySelectorAll('.main-content-wrapper section');
  const navLinks = document.querySelectorAll('.nav-item, .mobile-nav-item');
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  function showSection(targetId) {
    sections.forEach(sec => {
      if (sec.id === targetId) {
        sec.classList.add('active-section');
      } else {
        sec.classList.remove('active-section');
      }
    });
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${targetId}` || href === `/#${targetId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Smooth scroll page to top on tab change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || link.classList.contains('theme-toggle') || href.startsWith('./') || href.includes('//') || href.endsWith('.pdf') || href.endsWith('.html')) {
      return;
    }
    
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = href.replace(/^#/, '');
      
      history.pushState(null, null, href);
      showSection(targetId);
    });
  });
  
  // Set initial section active based on hash
  const initialHash = window.location.hash.replace(/^#/, '');
  const validSections = Array.from(sections).map(s => s.id);
  
  if (initialHash && validSections.includes(initialHash)) {
    showSection(initialHash);
  } else {
    showSection('home');
  }
  
  // Browser back/forward navigation support
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && validSections.includes(hash)) {
      showSection(hash);
    } else {
      showSection('home');
    }
  });
}

/**
 * IntersectionObserver-based entry fade animations (One-time reveal)
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-animate');
  
  if (animatedElements.length === 0) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px', // Trigger slide-in slightly before entering screen
    threshold: 0.05
  };
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Reveal once and keep it visible
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

/**
 * Premium Custom Cursor follower with inertia
 */
function initCursor() {
  // Respect system reduced-motion, and do not load on touch devices
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(any-hover: none)').matches;
  
  if (prefersReducedMotion || isTouchDevice) return;
  
  const cursor = document.createElement('div');
  cursor.className = 'cursor-follower';
  document.body.appendChild(cursor);
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.opacity = '1';
  });
  
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  
  function updatePosition() {
    // Lerping factor (0.15 makes a smooth elastic lag behind mouse)
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    cursorX += dx * 0.16;
    cursorY += dy * 0.16;
    
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate3d(-50%, -50%, 0)`;
    requestAnimationFrame(updatePosition);
  }
  updatePosition();
  
  // Custom Hover States expansion
  const hoverTargets = document.querySelectorAll('a, button, .gooey-item, .theme-toggle, .download-moving-border, .availability-badge');
  
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
    });
    target.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
    });
  });
}

/**
 * Availability status badge setup with click-to-connect interaction
 */
function initAvailabilityBadge() {
  const badge = document.querySelector('.availability-badge');
  if (!badge) return;
  
  badge.addEventListener('click', () => {
    const connectLink = document.querySelector('.nav-item[href="#connect"]');
    if (connectLink) {
      connectLink.click();
    }
  });
}
