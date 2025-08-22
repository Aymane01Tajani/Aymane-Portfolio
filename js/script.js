// Smooth scrolling for navigation links
document.querySelectorAll('.top-nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetSection = document.querySelector(this.getAttribute('href'));
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

// Scroll animations with intersection observer
const observerOptions = {
    root: null,
    threshold: 0.1,  // Start animation when 10% of the section is visible
    rootMargin: '-50px'  // Trigger slightly before the section comes into view
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.card');
            cards.forEach((card, index) => {
                // Clear any existing classes and styles
                card.classList.remove('reveal');
                card.style.transitionDelay = '';
                
                // Add reveal class with a staggered delay
                setTimeout(() => {
                    card.classList.add('reveal');
                }, index * 200); // 200ms delay between each card
            });
            
            // Unobserve after animation to prevent re-triggering
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Reset all cards to hidden state
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('reveal');
    });

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animate profile image on scroll
    const profilePic = document.querySelector('.profile-pic');
    if (profilePic) {
        window.addEventListener('scroll', () => {
            const rotation = window.scrollY / 20;
            profilePic.style.transform = `rotateZ(${rotation}deg)`;
        });
    }

    // Animate skill cards on hover
    const skillCards = document.querySelectorAll('.skills .card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
            const header = card.querySelector('h3');
            if (header) header.style.color = '#3498db';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
            const header = card.querySelector('h3');
            if (header) header.style.color = '#2c3e50';
        });
    });

    // Enhanced navigation highlighting
    updateNavigation();

    // Set initial language button state
    const currentLang = i18next.language || 'fr';
    updateLanguageButtons(currentLang);

    // Initialize carousels
    initializeCarousels();
});

// Smooth scroll with dynamic speed
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const distance = Math.abs(target.getBoundingClientRect().top);
            const duration = Math.min(1000, Math.max(500, distance / 2));
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active state to navigation based on scroll position
function updateNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.top-nav a');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Offset for better UX
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const currentId = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Add scroll event listener for navigation highlighting
window.addEventListener('scroll', updateNavigation);

// Handle language button active states
function changeLanguage(lng) {
  i18next.changeLanguage(lng, () => {
    updateContent();
    updateLanguageButtons(lng);
    updateCVDownloadLink(); // Also update CV link when language changes
  });
}

function updateLanguageButtons(currentLang) {
  document.querySelectorAll('.language-switcher button').forEach(button => {
    const lang = button.getAttribute('onclick').match(/'([^']+)'/)[1];
    if (lang === currentLang) {
      button.style.background = '#3498db';  // Blue for active
    } else {
      button.style.background = '#2c3e50';  // Grey for inactive
    }
  });
}

function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(function(element) {
    var key = element.getAttribute('data-i18n');
    element.innerHTML = i18next.t(key);
  });
  
  // Sort certification cards to maintain order
  const certificationSection = document.querySelector('#certifications .cards-container');
  if (certificationSection) {
    const cards = Array.from(certificationSection.querySelectorAll('.card'));
    cards.sort((a, b) => {
      const aIndex = a.getAttribute('data-item-index');
      const bIndex = b.getAttribute('data-item-index');
      return parseInt(aIndex) - parseInt(bIndex);
    });
    cards.forEach(card => certificationSection.appendChild(card));
  }
  
  updateCVDownloadLink();
}

function updateCVDownloadLink() {
  const downloadBtn = document.querySelector('.cv-download .download-btn');
  if (downloadBtn) {
    const currentLang = i18next.language || 'fr';
    const fileName = `TAJANI-AYMANE-CV${currentLang === 'en' ? '-ANG' : ''}.pdf`;
    downloadBtn.setAttribute('href', `assets/docs/${fileName}`);
    downloadBtn.setAttribute('download', fileName);
  }
}

function downloadCV(event) {
  // Remove this function as we're no longer customizing the download
  return true;
}

// Carousel functionality
function initializeCarousels() {
  // Initialize each carousel in the document
  document.querySelectorAll('.carousel-container').forEach(container => {
    const track = container.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const dotsContainer = container.querySelector('.carousel-dots');
    const prevButton = container.querySelector('.carousel-button.prev');
    const nextButton = container.querySelector('.carousel-button.next');
    
    let currentSlideIndex = 0;
    const totalSlides = slides.length;

    // Clear existing dots first
    dotsContainer.innerHTML = '';
    
    // Create dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.children);
    
    function updateCarousel() {
      // Move the track
      const slideWidth = slides[0].offsetWidth;
      track.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
      
      // Update dots
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlideIndex);
      });

      // Update visibility of slides
      slides.forEach((slide, idx) => {
        if (idx === currentSlideIndex) {
          slide.style.opacity = '1';
          slide.style.visibility = 'visible';
        } else {
          slide.style.opacity = '0.3';
          slide.style.visibility = 'visible';
        }
      });
    }
    
    function goToSlide(index) {
      if (index < 0) {
        currentSlideIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentSlideIndex = 0;
      } else {
        currentSlideIndex = index;
      }
      updateCarousel();
    }
    
    function nextSlide() {
      goToSlide(currentSlideIndex + 1);
    }
    
    function prevSlide() {
      goToSlide(currentSlideIndex - 1);
    }
    
    // Add button listeners
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    // Add touch support
    let touchStartX = null;
    let touchStartTransform = 0;
    
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartTransform = currentSlideIndex * slides[0].offsetWidth;
    }, { passive: true });
    
    track.addEventListener('touchmove', (e) => {
      if (touchStartX === null) return;
      
      const touchCurrentX = e.touches[0].clientX;
      const diff = touchStartX - touchCurrentX;
      const newTransform = touchStartTransform + diff;
      
      track.style.transform = `translateX(-${newTransform}px)`;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      const slideWidth = slides[0].offsetWidth;
      
      if (Math.abs(diff) > slideWidth * 0.2) { // 20% threshold
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      } else {
        // Return to current slide
        updateCarousel();
      }
      
      touchStartX = null;
    }, { passive: true });
    
    // Initialize carousel
    updateCarousel();
    
    // Handle window resize
    window.addEventListener('resize', updateCarousel);
  });
}

// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Reset all cards to hidden state
  document.querySelectorAll('.card').forEach(card => {
    card.classList.remove('reveal');
  });

  // Observe all sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    observer.observe(section);
  });

  // Add hover effects to cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Initialize carousels
  initializeCarousels();

  // Enhanced navigation highlighting
  updateNavigation();

  // Set initial language button state
  const currentLang = i18next.language || 'fr';
  updateLanguageButtons(currentLang);

  // Mobile Navigation Auto-Scroll
  let isScrolling = false;

  function handleMobileNavScroll() {
    const nav = document.querySelector('.top-nav ul');
    const activeLink = document.querySelector('.top-nav a.active');
    
    if (activeLink && nav && window.innerWidth <= 768) {
      if (!isScrolling) {
        isScrolling = true;
        
        const navRect = nav.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        const scrollLeft = nav.scrollLeft;
        
        // Calculate the position to center the active link
        const targetScroll = scrollLeft + (linkRect.left - navRect.left) - (navRect.width / 2) + (linkRect.width / 2);
        
        nav.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
        
        setTimeout(() => {
          isScrolling = false;
        }, 300);
      }
    }
  }

  // Section detection for navigation highlighting
  function detectCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.top-nav a');
    
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.scrollY;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    // Update active navigation link
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
    
    // Trigger mobile nav scroll
    handleMobileNavScroll();
  }

  // Throttled scroll event listener
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(detectCurrentSection, 10);
  });

  // Initial section detection
  detectCurrentSection();
});