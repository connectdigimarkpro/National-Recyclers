document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     STICKY HEADER & SCROLL BEHAVIOR
     ========================================================================== */
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    trackScrollSpy();
  });

  /* ==========================================================================
     MOBILE NAVIGATION (HAMBURGER)
     ========================================================================== */
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      navMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', !isOpen);
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     SCROLL SPY (HIGHLIGHT ACTIVE LINK)
     ========================================================================== */
  const sections = document.querySelectorAll('section, header');
  
  function trackScrollSpy() {
    let scrollPosition = window.scrollY + 100; // offset for sticky nav

    sections.forEach(section => {
      if (section.id === 'header') return;
      
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const matchingLink = Array.from(navLinks).find(link => link.getAttribute('href') === `#${sectionId}`);
        if (matchingLink) {
          navLinks.forEach(link => link.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  }

  /* ==========================================================================
     INTERACTIVE VALUE & IMPACT ESTIMATOR
     ========================================================================== */
  const calcMaterial = document.getElementById('calc-material');
  const calcWeight = document.getElementById('calc-weight');
  const calcSlider = document.getElementById('calc-slider');
  const sliderValLabel = document.getElementById('slider-val');
  
  const resultPriceTier = document.getElementById('result-price-tier');
  const resultCo2 = document.getElementById('result-co2');
  const resultTrees = document.getElementById('result-trees');
  const btnApplyCalc = document.getElementById('btn-apply-calc');

  // Multipliers for Environmental Calculations
  // Key: material name -> { co2Multiplier (kg saved per kg), treeMultiplier (trees per kg), tierName }
  const materialData = {
    Copper: { co2: 2.8, trees: 0.14, tier: 'Premium-Value Payout' },
    Aluminium: { co2: 9.1, trees: 0.45, tier: 'High-Value Payout' },
    Steel: { co2: 1.5, trees: 0.08, tier: 'High-Volume Standard' },
    Brass: { co2: 2.4, trees: 0.12, tier: 'Premium-Value Payout' },
    Batteries: { co2: 1.2, trees: 0.06, tier: 'Specialist Lead Payout' },
    PvcCable: { co2: 2.9, trees: 0.15, tier: 'Premium-Value Payout' },
    Tungsten: { co2: 4.5, trees: 0.22, tier: 'High-Value Alloy Payout' },
    DrillingTools: { co2: 2.2, trees: 0.11, tier: 'Heavy Industrial Volume' }
  };

  function updateEstimator() {
    const material = calcMaterial.value;
    const weight = parseFloat(calcWeight.value) || 0;
    const data = materialData[material];

    if (!data) return;

    // Run Calculations
    const calculatedCo2 = Math.round(weight * data.co2);
    const calculatedTrees = Math.round(weight * data.trees);

    // Format numbers with thousands separators
    const formattedCo2 = calculatedCo2.toLocaleString();
    const formattedTrees = calculatedTrees.toLocaleString();

    // Render results
    resultPriceTier.textContent = data.tier;
    
    // Ticker/counter styling effects for values
    resultCo2.textContent = `${formattedCo2} kg`;
    resultTrees.textContent = `${formattedTrees} Trees`;
  }

  if (calcMaterial && calcWeight && calcSlider) {
    // Sync Number Input with Slider
    calcWeight.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0;
      calcSlider.value = val;
      sliderValLabel.textContent = `${val.toLocaleString()} kg`;
      updateEstimator();
    });

    calcSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0;
      calcWeight.value = val;
      sliderValLabel.textContent = `${val.toLocaleString()} kg`;
      updateEstimator();
    });

    calcMaterial.addEventListener('change', updateEstimator);
    
    // Initial load calculation
    updateEstimator();
  }

  /* ==========================================================================
     MATERIAL CARD SELECT BUTTONS
     ========================================================================== */
  const selectMaterialBtns = document.querySelectorAll('.select-material-btn');
  const quoteMaterialSelect = document.getElementById('contact-material');
  const quoteQuantityInput = document.getElementById('contact-quantity');

  selectMaterialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Don't execute normal anchor click directly to avoid disjointed jumping
      e.preventDefault();
      
      const targetMaterial = btn.getAttribute('data-target');
      if (calcMaterial) {
        calcMaterial.value = targetMaterial;
        // Trigger update event
        calcMaterial.dispatchEvent(new Event('change'));
      }

      // Smooth scroll to estimator
      const targetSec = document.querySelector(btn.getAttribute('href'));
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ==========================================================================
     APPLY CALCULATOR VALUES TO QUOTE FORM
     ========================================================================== */
  if (btnApplyCalc && quoteMaterialSelect && quoteQuantityInput) {
    btnApplyCalc.addEventListener('click', () => {
      const selectedMat = calcMaterial.value;
      const weightVal = calcWeight.value;

      // Map calculator values to Main Contact Form fields
      quoteMaterialSelect.value = selectedMat;
      quoteQuantityInput.value = `${weightVal} kg`;

      // Smooth scroll to contact form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Highlight form inputs briefly for user feedback
        quoteMaterialSelect.style.outline = '3px solid var(--color-accent)';
        quoteQuantityInput.style.outline = '3px solid var(--color-accent)';
        
        setTimeout(() => {
          quoteMaterialSelect.style.outline = 'none';
          quoteQuantityInput.style.outline = 'none';
        }, 1500);
      }
    });
  }

  /* ==========================================================================
     STATS NUMERICAL COUNTERS ANIMATION
     ========================================================================== */
  const statsSection = document.getElementById('about');
  const statTonnes = document.getElementById('stat-tonnes');
  const statClients = document.getElementById('stat-clients');
  const statRate = document.getElementById('stat-rate');
  
  let countersAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        animateCounters();
        countersAnimated = true;
      }
    });
  }, { threshold: 0.3 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  function animateCounters() {
    animateSingleCounter(statTonnes, 0, 18, 1500, 'k+');
    animateSingleCounter(statClients, 0, 250, 1800, '+');
    animateSingleCounter(statRate, 0, 98, 1200, '%');
  }

  function animateSingleCounter(element, start, end, duration, suffix = '') {
    if (!element) return;
    
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentVal = Math.floor(progress * (end - start) + start);
      element.innerHTML = `${currentVal}<span>${suffix}</span>`;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.innerHTML = `${end}<span>${suffix}</span>`;
      }
    }
    
    window.requestAnimationFrame(step);
  }

  /* ==========================================================================
     FORM VALIDATION & SUCCESS MODAL
     ========================================================================== */
  const heroForm = document.getElementById('hero-quick-form');
  const quoteForm = document.getElementById('quote-request-form');
  const successModalOverlay = document.getElementById('success-modal-overlay');
  const btnCloseModal = document.getElementById('btn-close-modal');

  function showSuccessModal() {
    if (successModalOverlay) {
      successModalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    }
  }

  function hideSuccessModal() {
    if (successModalOverlay) {
      successModalOverlay.classList.remove('open');
      document.body.style.overflow = 'auto'; // Unlock background scrolling
    }
  }

  // Quick Hero Form Submission
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic mock submission validation
      const name = document.getElementById('quick-name').value.trim();
      const phone = document.getElementById('quick-phone').value.trim();
      const material = document.getElementById('quick-material').value;

      if (name && phone && material) {
        // Mock successful transaction
        showSuccessModal();
        heroForm.reset();
      }
    });
  }

  // Detailed Quote Form Submission
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic field checking
      const name = document.getElementById('contact-name').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const material = document.getElementById('contact-material').value;
      const quantity = document.getElementById('contact-quantity').value.trim();

      if (name && phone && email && material && quantity) {
        showSuccessModal();
        quoteForm.reset();
      }
    });
  }

  /* ==========================================================================
     OPERATIONAL GALLERY CATALOG LOGIC
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const btnLoadMore = document.getElementById('btn-load-more');
  
  let currentLimit = 8;
  let activeFilter = 'all';

  function applyGalleryFilterAndLimit() {
    let visibleCount = 0;
    
    galleryItems.forEach(item => {
      const matchesFilter = activeFilter === 'all' || item.classList.contains(activeFilter);
      
      if (matchesFilter) {
        visibleCount++;
        if (visibleCount <= currentLimit) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      } else {
        item.classList.add('hidden');
      }
    });

    // Toggle Load More button visibility
    const totalMatching = Array.from(galleryItems).filter(item => 
      activeFilter === 'all' || item.classList.contains(activeFilter)
    ).length;

    if (btnLoadMore) {
      if (visibleCount > currentLimit && currentLimit < totalMatching) {
        btnLoadMore.style.display = 'inline-flex';
      } else {
        btnLoadMore.style.display = 'none';
      }
    }
  }

  // Filter Buttons Click
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      activeFilter = btn.getAttribute('data-filter');
      // Reset limit when filter changes
      currentLimit = 8;
      applyGalleryFilterAndLimit();
    });
  });

  // Load More Click
  if (btnLoadMore) {
    btnLoadMore.addEventListener('click', () => {
      currentLimit += 8; // load 8 more images
      applyGalleryFilterAndLimit();
    });
  }

  // Lightbox Modal Logic
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCat = document.getElementById('lightbox-category');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  let activeIndex = -1;
  let activeLightboxItems = [];

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    
    // Get currently visible items to navigate through
    activeLightboxItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
    activeIndex = activeLightboxItems.indexOf(galleryItems[index]);
    
    if (activeIndex === -1) {
      // Fallback if the clicked element is not in visible items
      activeLightboxItems = [galleryItems[index]];
      activeIndex = 0;
    }
    
    updateLightboxContent();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden'; // lock scroll
  }

  function updateLightboxContent() {
    if (activeIndex < 0 || activeIndex >= activeLightboxItems.length) return;
    
    const currentItem = activeLightboxItems[activeIndex];
    const imgEl = currentItem.querySelector('.gallery-img');
    const titleEl = currentItem.querySelector('.gallery-info h4');
    const catEl = currentItem.querySelector('.gallery-info p');
    
    if (imgEl && lightboxImg) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt;
    }
    if (titleEl && lightboxTitle) {
      lightboxTitle.textContent = titleEl.textContent;
    }
    if (catEl && lightboxCat) {
      lightboxCat.textContent = catEl.textContent;
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = 'auto'; // unlock scroll
    }
  }

  function showNextImage() {
    if (activeLightboxItems.length <= 1) return;
    activeIndex = (activeIndex + 1) % activeLightboxItems.length;
    updateLightboxContent();
  }

  function showPrevImage() {
    if (activeLightboxItems.length <= 1) return;
    activeIndex = (activeIndex - 1 + activeLightboxItems.length) % activeLightboxItems.length;
    updateLightboxContent();
  }

  // Attach click listener to gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  // Lightbox control buttons
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  // Close when clicking outside content
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  });

  // Run initial state
  applyGalleryFilterAndLimit();

  /* ==========================================================================
     BUSINESS RESULTS SECTION ANIMATIONS & INTERACTIVE COUNTERS
     ========================================================================== */
  const businessResultsSection = document.getElementById('business-results');
  let premiumCountersAnimated = false;

  function animatePremiumCounter(element, start, end, duration) {
    if (!element) return;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentVal = Math.floor(progress * (end - start) + start);
      element.textContent = currentVal;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = end;
      }
    }
    
    window.requestAnimationFrame(step);
  }

  const resultsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger reveal animations
        const revealElements = document.querySelectorAll('#business-results .animate-reveal');
        revealElements.forEach(el => el.classList.add('reveal-active'));

        // Trigger counters once
        if (!premiumCountersAnimated) {
          const premiumStats = document.querySelectorAll('#business-results .stat-number-value');
          premiumStats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target')) || 0;
            animatePremiumCounter(stat, 0, target, 2000);
          });
          premiumCountersAnimated = true;
        }
      }
    });
  }, { threshold: 0.15 });

  if (businessResultsSection) {
    resultsObserver.observe(businessResultsSection);
  }

});

