(function() {

  const isDesktopNav = drupalSettings.olivero.isDesktopNav;

  const mobileNavButton = document.querySelector('.mobile-nav-button');
  const mobileNavWrapperId = 'header-nav';
  const mobileNavWrapper = document.getElementById(mobileNavWrapperId);
  const body = document.querySelector('body');
  const overlay = document.querySelector('.overlay');

  const focusableNavElements = mobileNavWrapper.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstFocusableEl = focusableNavElements[0];
  const lastFocusableEl = focusableNavElements[focusableNavElements.length - 1];

  function init() {
    mobileNavButton.setAttribute('aria-controls', mobileNavWrapperId);
    mobileNavButton.setAttribute('aria-expanded', 'false');
  }

  function isMobileNavOpen() {
    return mobileNavWrapper.classList.contains('is-active');
  }

  /**
   * Opens or closes the mobile navigation.
   * @param {boolean} state - State which to transition the mobile navigation menu into.
   */
  function toggleMobileNav(state) {
    const value = state ? true : false;
    mobileNavButton.setAttribute('aria-expanded', value);

    // Overlay
    if (value) {
      body.classList.add('js-overlay-active');
      body.classList.add('js-fixed');
      mobileNavWrapper.classList.add('is-active');
    }
    else {
      body.classList.remove('js-overlay-active');
      body.classList.remove('js-fixed');
      mobileNavWrapper.classList.remove('is-active');
    }
  }

  // Initialize everything.

  init();

  mobileNavButton.addEventListener('click', () => {
    toggleMobileNav(!isMobileNavOpen());
  });

  document.addEventListener('keyup', e => {
    if (e.keyCode === 27) {
      toggleMobileNav(false);
    }
  });

  overlay.addEventListener('click', () => {
    toggleMobileNav(false);
  });

  overlay.addEventListener('touchstart', () => {
    toggleMobileNav(false);
  });

  // Focus trap.
  mobileNavWrapper.addEventListener('keydown', function(e) {
    if (e.key === 'Tab' || e.keyCode === 9) {
      if ( e.shiftKey ) /* shift + tab */ {
        if (document.activeElement === firstFocusableEl && !isDesktopNav()) {
          mobileNavButton.focus();
          e.preventDefault();
        }
      } else /* tab */ {
        if (document.activeElement === lastFocusableEl && !isDesktopNav()) {
          mobileNavButton.focus();
          e.preventDefault();
        }
      }
    }
  });

  // If site branding and primary nav collide, force mobile nav
  if ("IntersectionObserver" in window) {
    const observerConfig = {
      root: document.querySelector('.site-header'),
      rootMargin: '0px -75% 0px 0px'
    };

    const siteBrandingObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio !== 0) {
            body.classList.add('is-always-mobile-nav');
          }
        });
      },
      observerConfig
    );

    const primaryNav = document.querySelector('.primary-nav');
    siteBrandingObserver.observe(primaryNav);
  }

  // Remove overlays when browser is resized and desktop nav appears.
  // @todo Use core/drupal.debounce library to throttle when we move into theming.
  window.addEventListener('resize', () => {
    if (drupalSettings.olivero.isDesktopNav) {
      toggleMobileNav(false);
      body.classList.remove('js-overlay-active', 'js-fixed');
    }
  });

})()
